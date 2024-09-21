import { PositionData, VatsimDataWS } from "@/types/vatsim"
import { Attitude, FlightFeature, MapStorage } from "@/types/map"
import { fromLonLat } from "ol/proj"
import { RefObject } from "react"
import GeoJSON from 'ol/format/GeoJSON'
import { Feature } from "ol"
import { Point } from "ol/geom"
import { updateFlightOverlayContent, updateOverlayPosition } from "./overlays"

export function updateFlightFeatures(mapRef: RefObject<MapStorage>, vatsimData: VatsimDataWS | null) {
    if (!mapRef.current || !vatsimData?.position) return

    const tOffset = (Date.now() - mapRef.current.layerInit.getTime()) / 1000
    const flights = structuredClone(vatsimData.position)
    const prevFeatures = mapRef.current.sources.flights.getFeatures()
    const checked: PositionData[] = []

    for (const feature of prevFeatures as Feature<Point>[]) {
        const newData = flights.find(flight => flight.callsign === feature.get('callsign'))

        if (!newData) {
            mapRef.current!.sources.flights.removeFeature(feature)
            continue
        }

        feature.set('prevRotation', feature.get('rotation'))
        feature.set('rotation', newData.heading / 180 * Math.PI)
        feature.set('tOffset', tOffset)
        feature.set('attitude', {
            coordinates: newData.coordinates,
            altitudes: newData.altitudes,
            groundspeeds: newData.groundspeeds,
            heading: newData.heading
        } as Attitude)
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
        const timeElapsed = (Date.now() - new Date(insert.timestamp).getTime()) / 1000
        const attitude: Attitude = {
            coordinates: insert.coordinates,
            altitudes: insert.altitudes,
            groundspeeds: insert.groundspeeds,
            heading: insert.heading
        }
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

    updateFlightOverlayContent(mapRef)
}

export function getInterpolatedPosition(position: Attitude, timeElapsed: number): number[] {
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

    updateOverlayPosition(mapRef)
}