import { Feature, MultiPolygon, Point } from "geojson"
import { Document } from "mongoose"
import { VatsimStorageGeneralData, VatsimStorageStatusData } from "./vatsim"

export interface ClientDatabaseAirports {
    version: string,
    data?: Feature<Point>[] | null
}

export interface ClientDatabaseSectors {
    version: string,
    data?: Feature<MultiPolygon>[] | null
}

export interface ClientDatabaseDataStorage {
    airports: ClientDatabaseAirports,
    firs: ClientDatabaseSectors,
    tracons: ClientDatabaseSectors
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

export interface MongoDbFlightSchema extends Document {
    hash: string,
    general: VatsimStorageGeneralData,
    status: VatsimStorageStatusData,
    createdAt: Date
}