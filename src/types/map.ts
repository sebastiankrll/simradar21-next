import { Feature as oFeature, Map, Overlay } from "ol";
import VectorSource from "ol/source/Vector";
import { GeneralData, PositionData, StatusData } from "./vatsim";
import { Feature, GeoJsonProperties, Point } from "geojson";

export interface VectorSources {
    [key: string]: VectorSource
}

export interface MapStorage {
    map: Map | null,
    layerInit: Date,
    sources: VectorSources,
    overlays: {
        click: Overlay[] | null,
        hover: Overlay[] | null
    },
    features: {
        click: oFeature | null,
        hover: oFeature | null,
        route: oFeature | null
    }
}

export interface FlightData {
    position: PositionData | null,
    general: GeneralData | null,
    status: StatusData | null
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
    attitude: Object,
    altitude: number,
    frequency: string,
    connected: boolean,
    timestamp: Date
}

export interface FlightFeature extends Feature<Point> {
    properties: FlightProperties
}