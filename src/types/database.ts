import { Feature, MultiPolygon, Point } from "geojson"

export interface DatabaseAirports {
    version: string,
    data: Feature<Point>[] | null
}

export interface DatabaseSectors {
    version: string,
    data: Feature<MultiPolygon>[] | null
}

export interface DatabaseDataStorage {
    airports: DatabaseAirports,
    firs: DatabaseSectors,
    tracons: DatabaseSectors
}

export interface IndexedDBData {
    id: number,
    icao: string,
    feature: Feature<Point> | Feature<MultiPolygon>
}

export interface IndexedDBVersion {
    id: number,
    version: string
}