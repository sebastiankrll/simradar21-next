import { MapStorage } from "@/types/map";
import { Feature, GeoJsonProperties, Point } from "geojson";
import VectorSource from "ol/source/Vector";
import { getGlobalVatsimStorage } from "./global";
import GeoJSON from 'ol/format/GeoJSON'

function initFeatures(): Feature<Point, GeoJsonProperties>[] {
    const vatsimDataStorage = getGlobalVatsimStorage()
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

export const mapStorage: MapStorage = {
    map: null,
    sources: {
        firs: new VectorSource(),
        tracons: new VectorSource(),
        firLabels: new VectorSource(),
        airportLabels: new VectorSource(),
        airports: new VectorSource(),
        routes: new VectorSource(),
        flights: new VectorSource({
            features: new GeoJSON().readFeatures({
                type: 'FeatureCollection',
                features: initFeatures(),
                featureProjection: 'EPSG:3857',
            })
        }),
        airportTops: new VectorSource()
    },
    overlays: {
        click: null,
        hover: null
    },
    features: {
        click: null,
        hover: null,
        route: null
    }
}