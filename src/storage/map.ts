import { VatsimDataStorage } from "@/types/data/vatsim";
import { MapStorage } from "@/types/map";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON'
import { initFeatures } from "@/components/map/utils/init";

const mapStorage: MapStorage = {
    map: null,
    sources: {
        firs: new VectorSource(),
        tracons: new VectorSource(),
        firLabels: new VectorSource(),
        airportLabels: new VectorSource(),
        airports: new VectorSource(),
        routes: new VectorSource(),
        flights: new VectorSource(),
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

export function initMapStorage(vatsimData: VatsimDataStorage): MapStorage {
    const flightFeatures = initFeatures(vatsimData)
    mapStorage.sources.flights.addFeatures(
        new GeoJSON().readFeatures({
            type: 'FeatureCollection',
            features: flightFeatures
        }, {
            featureProjection: 'EPSG:3857',
        })
    )

    return mapStorage
}