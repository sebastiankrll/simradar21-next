import { MapStorage } from "@/types/map";
import VectorSource from "ol/source/Vector";

export const mapStorage: MapStorage = {
    map: null,
    layerInit: new Date(),
    animate: true,
    sources: {
        sun: new VectorSource({
            wrapX: false
        }),
        firs: new VectorSource(),
        tracons: new VectorSource(),
        firLabels: new VectorSource(),
        airportLabels: new VectorSource(),
        airports: new VectorSource(),
        tracks: new VectorSource(),
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
        track: null,
        init: null
    },
    view: {
        lastView: null,
        viewInit: false
    }
}