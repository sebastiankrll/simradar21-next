import { getAllAirports } from "@/storage/client-database";
import { IndexedAirportFeature, MapStorage } from "@/types/map";
import bbox from "@turf/bbox";
import { BBox } from "geojson";
import { transformExtent } from "ol/proj";
import RBush from "rbush";
import { RefObject } from "react";
import GeoJSON from 'ol/format/GeoJSON'
import { VatsimDataWS } from "@/types/vatsim";

const rbush = new RBush<IndexedAirportFeature>()

export async function initAirportFeatures(mapRef: RefObject<MapStorage>, vatsimData: VatsimDataWS | null) {
    const airportFeatures = await getAllAirports()
    if (!airportFeatures) return

    const indexedFeatures: IndexedAirportFeature[] = airportFeatures.map((feature) => {
        const [minX, minY, maxX, maxY]: BBox = bbox(feature)
        return {
            minX,
            minY,
            maxX,
            maxY,
            feature,
        }
    })
    rbush.load(indexedFeatures)
    setAirportFeaturesByExtent(mapRef)
}

export function setAirportFeaturesByExtent(mapRef: RefObject<MapStorage>) {
    const map = mapRef.current?.map
    const resolution = map?.getView().getResolution()
    if (!resolution || !map) {
        mapRef.current?.sources.airports.clear()
        return
    }

    let sizeArray = null

    if (resolution <= 3000) {
        sizeArray = ['large_airport']
    }

    if (resolution < 1000) {
        sizeArray = ['large_airport', 'medium_airport']
    }

    if (resolution < 300) {
        sizeArray = ['large_airport', 'medium_airport', 'small_airport']
    }

    if (!sizeArray) {
        mapRef.current?.sources.airports.clear()
        return
    }

    const [minX, minY, maxX, maxY] = transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326')
    const featuresByExtent = rbush.search({ minX, minY, maxX, maxY }).map((entry) => entry.feature)
    const featuresBySize = sizeArray ? featuresByExtent.filter(feature => sizeArray.includes(feature.properties?.type)) : []

    mapRef.current?.sources.airports.clear()
    mapRef.current?.sources.airports.addFeatures(
        new GeoJSON().readFeatures({
            type: 'FeatureCollection',
            features: featuresBySize
        }, {
            featureProjection: 'EPSG:3857',
        })
    )
}

export function updateAirportFeatures(mapRef: RefObject<MapStorage>, vatsimData: VatsimDataWS | null) {
    const features = [] // Use separate storage for rbush and features itself to filter features here, otherwise everytime all feature would needed to be loaded here
    const controllers = vatsimData?.controllers
    if (!controllers) return

    const keys = Object.keys(controllers)

    for (const key of keys) {
        let stations = [0, 0, 0, 0]

        controllers[key].forEach(station => {
            if (station.facility === -1) {
                stations[3] = 1
            }
            if (station.fc === 2) {
                stations[2] = 1
            }
            if (station.fc === 3) {
                stations[1] = 1
            }
            if (station.fc === 4) {
                stations[0] = 1
            }
        })

        feature.properties.offset = parseInt(stations.join(''), 2) * 36
        feature.properties.stations = airports[key]
    }

    mapRef.current?.sources.airportLabels.clear()
    mapRef.current?.sources.airportLabels.addFeatures(
        new GeoJSON().readFeatures({
            type: 'FeatureCollection',
            features: features
        }, {
            featureProjection: 'EPSG:3857',
        })
    )
}