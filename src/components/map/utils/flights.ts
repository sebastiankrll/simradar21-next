import { fromLonLat } from "ol/proj"
import GeoJSON from 'ol/format/GeoJSON'
import { Feature } from "ol"
import { Point } from "ol/geom"
import { createFlightOverlay, moveFlightOverlay, updateFlightOverlay } from "./overlay"
import { moveTrack, updateTrack } from "./track"
import { moveViewToFeature } from "./misc"
import { mapStorage } from "@/storage/client/map"
import { VatsimMinimalData, VatsimStoragePositionData } from "@/types/vatsim"
import { OlFlightFeature, OlFlightFeatureAttitude } from "@/types/map"

export function updateFlightFeatures(vatsimData: VatsimMinimalData | null) {
    if (!vatsimData?.positions) return

    const tOffset = (Date.now() - mapStorage.layerInit.getTime()) / 1000
    const flights = structuredClone(vatsimData.positions)
    const prevFeatures = mapStorage.sources.flights.getFeatures()
    const checked: VatsimStoragePositionData[] = []

    for (const feature of prevFeatures as Feature<Point>[]) {
        const newData = flights.find(flight => flight.callsign === feature.get('callsign'))

        if (!newData) {
            mapStorage.sources.flights.removeFeature(feature)
            continue
        }

        const attitude: OlFlightFeatureAttitude = {
            coordinates: newData.coordinates,
            altitudes: newData.altitudes,
            groundspeeds: newData.groundspeeds,
            heading: newData.heading
        }

        const timeElapsed = (Date.now() - new Date(newData.timestamp).getTime()) / 1000
        const interpolatedPosition = getInterpolatedPosition(attitude, timeElapsed)
        feature.getGeometry()?.setCoordinates(fromLonLat(interpolatedPosition))

        feature.set('shape', newData.aircraft ? newData.aircraft : 'A320')
        feature.set('prevRotation', feature.get('rotation'))
        feature.set('rotation', newData.heading / 180 * Math.PI)
        feature.set('tOffset', tOffset)
        feature.set('attitude', attitude)
        feature.set('altitude', newData.altitudes[0])
        feature.set('frequency', newData.frequency)
        feature.set('airline', newData.airline)
        feature.set('airports', newData.airports)
        feature.set('connected', newData.connected ? 1 : 0)
        feature.set('timestamp', new Date(newData.timestamp))

        checked.push(newData)
    }

    const inserts = flights.filter(flight => !checked.includes(flight))
    const newFeatures: OlFlightFeature[] = inserts.map(insert => {
        const attitude: OlFlightFeatureAttitude = {
            coordinates: insert.coordinates,
            altitudes: insert.altitudes,
            groundspeeds: insert.groundspeeds,
            heading: insert.heading
        }

        const timeElapsed = (Date.now() - new Date(insert.timestamp).getTime()) / 1000
        const interpolatedPosition = getInterpolatedPosition(attitude, timeElapsed)

        return {
            type: "Feature",
            properties: {
                callsign: insert.callsign,
                type: 'flight',
                hover: 0,
                shape: insert.aircraft ? insert.aircraft : 'A320',
                rotation: insert.heading / 180 * Math.PI,
                prevRotation: insert.heading / 180 * Math.PI,
                tOffset: tOffset,
                attitude: attitude,
                altitude: insert.altitudes[0],
                frequency: insert.frequency,
                airline: insert.airline,
                airports: insert.airports,
                connected: insert.connected ? 1 : 0,
                timestamp: new Date(insert.timestamp)
            },
            geometry: {
                type: "Point",
                coordinates: interpolatedPosition
            }
        }
    })

    mapStorage.sources.flights.addFeatures(
        new GeoJSON().readFeatures({
            type: 'FeatureCollection',
            features: newFeatures
        }, {
            featureProjection: 'EPSG:3857',
        })
    )

    updateTrack()
    moveFlightOverlay()
    updateFlightOverlay()
}

function getInterpolatedPosition(attitude: OlFlightFeatureAttitude, timeElapsed: number): number[] {
    const spd = attitude.groundspeeds[0] * 0.514444
    const dist = spd * timeElapsed / 1000

    const dx = dist * Math.sin(attitude.heading * Math.PI / 180)
    const dy = dist * Math.cos(attitude.heading * Math.PI / 180)

    const newLat = attitude.coordinates[1] + (dy / 6378) * (180 / Math.PI)
    const newLon = attitude.coordinates[0] + (dx / 6378) * (180 / Math.PI) / Math.cos(attitude.coordinates[1] * Math.PI / 180)

    return [newLon, newLat]
}

export function moveFlightFeatures() {
    const features = mapStorage.sources.flights.getFeatures() as Feature<Point>[]

    features.forEach(feature => {
        const timeElapsed = (Date.now() - new Date(feature.get('timestamp')).getTime()) / 1000
        const interpolatedPosition = getInterpolatedPosition(feature.get('attitude'), timeElapsed)
        feature.getGeometry()?.setCoordinates(fromLonLat(interpolatedPosition))
    })

    moveTrack()
    moveFlightOverlay()
}

let then: number = Date.now()
export function animateFlightFeatures() {
    if (!mapStorage.map) return

    const fpsInterval = 1000 / 30
    const limit = true
    const now = Date.now()
    const elapsed = now - then

    if (elapsed > fpsInterval || !limit) {
        if (mapStorage.animate) moveFlightFeatures()
        mapStorage.map.render()

        then = now - (elapsed % fpsInterval)
    }
}

let followInterval: NodeJS.Timeout
export function followFlightFeature() {
    const clickedFeature = mapStorage.features.click
    const map = mapStorage.map
    if (!clickedFeature || clickedFeature.get('type') !== 'flight' || !map) return

    mapStorage.view.lastView = map.getView().calculateExtent(map.getSize())
    moveViewToFeature(clickedFeature)

    followInterval = setInterval(() => {
        moveViewToFeature(clickedFeature)
    }, 5000)
}

export function unFollowFlightFeature() {
    clearInterval(followInterval)
}

export function setActiveFlightFeature(callsign: string, type: 'click' | 'hover' = 'click'): boolean {
    if (!mapStorage.map) return false

    const features = mapStorage.sources.flights.getFeatures() as Feature<Point>[]
    if (features.length < 1) return false

    const feature = features.find(feature => feature.get('callsign') === callsign)
    if (!feature) return false

    // Clean up old previous overlay first (dev mode only due to strict mode)
    if (mapStorage.overlays[type] && process.env.NODE_ENV === 'development') {
        const root = mapStorage.overlays[type].get('root')
        setTimeout(() => {
            root?.unmount()
        }, 0)

        mapStorage.map.removeOverlay(mapStorage.overlays[type])
        mapStorage.overlays[type] = null
    }

    mapStorage.features[type]?.set('hover', 0)

    feature.set('hover', 1)
    mapStorage.features[type] = feature

    const overlay = createFlightOverlay(feature as Feature<Point>, type === 'click' ? true : false)
    mapStorage.overlays[type] = overlay

    return true
}