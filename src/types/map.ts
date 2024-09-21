import { Feature as oFeature, Map, Overlay } from "ol";
import VectorSource from "ol/source/Vector";
import { Feature, Point } from "geojson";
import { Extent } from "openlayers";

export interface VectorSources {
    [key: string]: VectorSource
}

export interface MapStorage {
    map: Map | null,
    animate: boolean,
    layerInit: Date,
    sources: VectorSources,
    overlays: {
        click: Overlay | null,
        hover: Overlay | null
    },
    features: {
        click: oFeature | null,
        hover: oFeature | null,
        route: oFeature | null,
        init: string[] | null
    },
    view: {
        lastView: Extent | null,
        viewInit: boolean
    }
}

export interface Attitude {
    coordinates: number[],
    altitudes: number[],
    groundspeeds: number[],
    heading: number
}

interface FlightProperties {
    callsign: string,
    type: string,
    hover: number,
    shape: string,
    rotation: number,
    prevRotation: number,
    tOffset: number,
    attitude: Attitude,
    altitude: number,
    frequency: string,
    airline: string | null,
    airports: string[] | null,
    connected: number,
    timestamp: Date
}

export interface FlightFeature extends Feature<Point> {
    properties: FlightProperties
}