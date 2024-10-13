import { Feature as oFeature, Map, Overlay } from "ol";
import { LineString, Point as oPoint } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Feature, MultiPolygon, Point } from "geojson";
import { Extent } from "ol/extent";

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
        click: oFeature<oPoint> | null,
        hover: oFeature<oPoint> | null,
        track: oFeature<LineString> | null
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

export interface IndexedAirportFeature {
    minX: number
    minY: number
    maxX: number
    maxY: number
    feature: Feature<Point | MultiPolygon>
}