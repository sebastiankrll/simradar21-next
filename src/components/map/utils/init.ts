import { VatsimDataStorage } from "@/types/vatsim"
import { FlightFeature } from "@/types/map"
import { getInterpolatedPosition } from "./flights"

export function initFeatures(vatsimDataStorage: VatsimDataStorage): FlightFeature[] {
    if (!vatsimDataStorage?.position) return []

    const tOffset = 0
    const newFeatures = vatsimDataStorage.position.map(position => {
        const timeElapsed = (Date.now() - new Date(position.timestamp).getTime()) / 1000
        const attitude = {
            coordinates: position.coordinates,
            altitudes: position.altitudes,
            groundspeeds: position.groundspeeds,
            heading: position.heading
        }

        const interpolatedPosition = getInterpolatedPosition(attitude, timeElapsed)

        const newFeature: FlightFeature = {
            type: "Feature",
            properties: {
                callsign: position.callsign,
                type: 'flight',
                hover: 0,
                shape: position.aircraft ? position.aircraft : 'A320',
                rotation: position.heading / 180 * Math.PI,
                prevRotation: position.heading / 180 * Math.PI,
                tOffset: tOffset,
                attitude: attitude,
                altitude: position.altitudes[0],
                frequency: position.frequency,
                connected: position.connected,
                timestamp: position.timestamp
            },
            geometry: {
                type: "Point",
                coordinates: position.coordinates
            }
        }

        return newFeature
    })

    return newFeatures
}