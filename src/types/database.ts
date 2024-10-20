import { Feature, MultiPolygon, Point } from "geojson"
import { Document } from "mongoose"
import { GeneralData, StatusData } from "./vatsim"

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

export interface IndexedDBData<G extends Point | MultiPolygon> {
    id: number,
    icao: string,
    feature: Feature<G>
}

export interface IndexedDBVersion {
    id: number,
    version: string
}

export interface MongoFlightSchema extends Document {
    hash: string,
    general: GeneralData,
    status: StatusData,
    expireAt: Date
}