import { PositionData, VatsimDataWS } from "@/types/vatsim"
import { Attitude, FlightFeature, MapStorage } from "@/types/map"
import { fromLonLat } from "ol/proj"
import { RefObject } from "react"
import GeoJSON from 'ol/format/GeoJSON'
import { Feature } from "ol"
import { Point } from "ol/geom"
import { createFlightOverlay, moveFlightOverlay, updateFlightOverlay } from "./overlay"
import { moveTrack, updateTrack } from "./track"
import { moveViewToFeature } from "./misc"

export function updateFlightFeatures(mapRef: RefObject<MapStorage>, vatsimData: VatsimDataWS | null) {
    if (!mapRef.current || !vatsimData?.flights) return

    const tOffset = (Date.now() - mapRef.current.layerInit.getTime()) / 1000
    const flights = structuredClone(vatsimData.flights)
    const prevFeatures = mapRef.current.sources.flights.getFeatures()
    const checked: PositionData[] = []

    for (const feature of prevFeatures as Feature<Point>[]) {
        const newData = flights.find(flight => flight.callsign === feature.get('callsign'))

        if (!newData) {
            mapRef.current!.sources.flights.removeFeature(feature)
            continue
        }

        const attitude: Attitude = {
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
    const newFeatures: FlightFeature[] = inserts.map(insert => {
        const attitude: Attitude = {
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

    mapRef.current.sources.flights.addFeatures(
        new GeoJSON().readFeatures({
            type: 'FeatureCollection',
            features: newFeatures
        }, {
            featureProjection: 'EPSG:3857',
        })
    )

    updateTrack(mapRef)
    moveFlightOverlay(mapRef)
    updateFlightOverlay(mapRef)
}

function getInterpolatedPosition(position: Attitude, timeElapsed: number): number[] {
    const spd = position.groundspeeds[0] * 0.514444
    const dist = spd * timeElapsed / 1000

    const dx = dist * Math.sin(position.heading * Math.PI / 180)
    const dy = dist * Math.cos(position.heading * Math.PI / 180)

    const newLat = position.coordinates[1] + (dy / 6378) * (180 / Math.PI)
    const newLon = position.coordinates[0] + (dx / 6378) * (180 / Math.PI) / Math.cos(position.coordinates[1] * Math.PI / 180)

    return [newLon, newLat]
}

export function moveFlightFeatures(mapRef: RefObject<MapStorage>) {
    const features = mapRef.current?.sources.flights.getFeatures() as Feature<Point>[]

    features.forEach(feature => {
        const timeElapsed = (Date.now() - new Date(feature.get('timestamp')).getTime()) / 1000
        const interpolatedPosition = getInterpolatedPosition(feature.get('attitude'), timeElapsed)
        feature.getGeometry()?.setCoordinates(fromLonLat(interpolatedPosition))
    })

    moveTrack(mapRef)
    moveFlightOverlay(mapRef)
}

let then: number = Date.now()
export function animateFlightFeatures(mapRef: RefObject<MapStorage>) {
    if (!mapRef.current?.map) return

    const fpsInterval = 1000 / 30
    const limit = true
    const now = Date.now()
    const elapsed = now - then

    if (elapsed > fpsInterval || !limit) {
        if (mapRef.current.animate) moveFlightFeatures(mapRef)
        mapRef.current.map.render()

        then = now - (elapsed % fpsInterval)
    }
}

let followInterval: NodeJS.Timeout
export function followFlightFeature(mapRef: RefObject<MapStorage>) {
    const clickedFeature = mapRef.current?.features.click
    const map = mapRef.current?.map
    if (!clickedFeature || clickedFeature.get('type') !== 'flight' || !map) return

    mapRef.current.view.lastView = map.getView().calculateExtent(map.getSize())
    moveViewToFeature(mapRef, clickedFeature)

    followInterval = setInterval(() => {
        moveViewToFeature(mapRef, clickedFeature)
    }, 5000)
}

export function unFollowFlightFeature() {
    clearInterval(followInterval)
}

export function setActiveFlightFeature(mapRef: RefObject<MapStorage>, callsign: string, type: 'click' | 'hover' = 'click') {
    if (!mapRef.current?.map) return

    const features = mapRef.current.sources.flights.getFeatures() as Feature<Point>[]
    if (features.length > 0) {
        const feature = features.find(feature => feature.get('callsign') === callsign)
        if (!feature) return

        // Clean up old previous overlay first (dev mode only due to strict mode)
        if (mapRef.current.overlays[type] && process.env.NODE_ENV === 'development') {
            const root = mapRef.current.overlays[type].get('root')
            setTimeout(() => {
                root?.unmount()
            }, 0)

            mapRef.current.map.removeOverlay(mapRef.current.overlays[type])
            mapRef.current.overlays[type] = null
        }

        mapRef.current.features[type]?.set('hover', 0)

        feature.set('hover', 1)
        mapRef.current.features[type] = feature

        const overlay = createFlightOverlay(mapRef, feature as Feature<Point>, type === 'click' ? true : false)
        mapRef.current.overlays[type] = overlay

        return
    }
}