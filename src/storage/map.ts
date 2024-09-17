import { VatsimDataStorage } from "@/types/vatsim";
import { MapStorage } from "@/types/map";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON'
import { initFlightFeatures } from "@/components/map/utils/init";

const mapStorage: MapStorage = {
    map: null,
    layerInit: new Date(),
    sources: {
        sun: new VectorSource({
            wrapX: false
        }),
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
    },
    view: {
        lastView: null,
        viewInit: false
    }
}

export function initMapStorage(vatsimData: VatsimDataStorage): MapStorage {
    const flightFeatures = initFlightFeatures(vatsimData)
    mapStorage.sources.flights.clear()
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