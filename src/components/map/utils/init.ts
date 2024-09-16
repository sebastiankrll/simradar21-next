import { VatsimDataStorage } from "@/types/data/vatsim"
import { Feature, GeoJsonProperties, Point } from "geojson"

export function initFeatures(vatsimDataStorage: VatsimDataStorage): Feature<Point, GeoJsonProperties>[] {
    if (!vatsimDataStorage?.position) return []

    const tOffset = 0
    const newFeatures = vatsimDataStorage.position.map(position => {
        const pos = {
            coordinates: position.coordinates,
            altitudes: position.altitudes,
            groundspeeds: position.groundspeeds,
            heading: position.heading
        }

        const newFeature: Feature<Point, GeoJsonProperties> = {
            type: "Feature",
            properties: {
                callsign: position.callsign,
                type: 'flight',
                hover: 0,
                shape: position.aircraft ? position.aircraft : 'A320',
                rotation: position.heading / 180 * Math.PI,
                prevRotation: position.heading / 180 * Math.PI,
                tOffset: tOffset,
                pos: pos,
                altitude: position.altitudes[0],
                frequency: position.frequency
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