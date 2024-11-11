import { Feature as oFeature, Map, Overlay } from "ol";
import { LineString, Point as oPoint } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Feature, Point } from "geojson";
import { Extent } from "ol/extent";
import { VatsimStoragePositionAirline } from "./vatsim";

export interface OlMapStorage {
    map: Map | null,
    animate: boolean,
    layerInit: Date,
    sources: Record<string, VectorSource>,
    overlays: {
        click: Overlay | null,
        hover: Overlay | null
    },
    features: {
        click: oFeature<oPoint> | null,
        hover: oFeature<oPoint> | null,
        track: oFeature<LineString> | null
    },
    view: {
        lastView: Extent | null,
        viewInit: boolean
    }
}

export interface OlFlightFeatureAttitude {
    coordinates: number[],
    altitudes: number[],
    groundspeeds: number[],
    heading: number
}

export interface OlFlightFeatureProperties {
    callsign: string,
    type: string,
    hover: number,
    shape: string,
    rotation: number,
    prevRotation: number,
    tOffset: number,
    attitude: OlFlightFeatureAttitude,
    altitude: number,
    frequency: string,
    airline: VatsimStoragePositionAirline,
    airports: string[] | null,
    connected: number,
    timestamp: Date
}

export interface OlFlightFeature extends Feature<Point> {
    properties: OlFlightFeatureProperties
}