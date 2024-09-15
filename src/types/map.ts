import { Feature, Map, Overlay } from "ol";
import VectorSource from "ol/source/Vector";

export interface VectorSources {
    [key: string]: VectorSource
}

export interface MapStorage {
    map: Map | null,
    sources: VectorSources,
    overlays: {
        click: Overlay[] | null,
        hover: Overlay[] | null
    },
    features: {
        click: Feature | null,
        hover: Feature | null,
        route: Feature | null
    }
}