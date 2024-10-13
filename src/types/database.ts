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

export interface DatabaseClientData {
    id: number,
    version: string,
    data: Feature<Point>[] | Feature<MultiPolygon>[] | null
}