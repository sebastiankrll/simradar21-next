// import { getAirports } from "@/storage/db";
import { MapStorage } from "@/types/map";
// import { VatsimDataWS } from "@/types/vatsim";
import { RefObject } from "react";
import GeoJSON from 'ol/format/GeoJSON'

export async function initAirports(mapRef: RefObject<MapStorage>) {
    // const airportFeatures = await getAirports()
    mapRef.current?.sources.airports.clear()
    mapRef.current?.sources.airports.addFeatures(
        new GeoJSON().readFeatures({
            type: 'FeatureCollection',
            features: []
        }, {
            featureProjection: 'EPSG:3857',
        })
    )
}