import { getAirports } from "@/storage/db";
import { IndexedAirportFeature, MapStorage } from "@/types/map";
import bbox from "@turf/bbox";
import { BBox } from "geojson";
import { transformExtent } from "ol/proj";
import RBush from "rbush";
import { RefObject } from "react";
import GeoJSON from 'ol/format/GeoJSON'
import { VatsimDataWS } from "@/types/vatsim";

const rbush = new RBush<IndexedAirportFeature>()
let controllers

export async function initAirportFeatures(mapRef: RefObject<MapStorage>, vatsimData: VatsimDataWS | null) {
    const airportFeatures = await getAirports()
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

    controllers = vatsimData?.controllers
    console.log(controllers)
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