import { ClientDatabaseDataStorage, MongoDbFlightSchema } from "@/types/database"
import { VatsimDataStorage } from "@/types/vatsim"
import mongoose from "mongoose"

declare const globalThis: {
    vatsimDataStorage: VatsimDataStorage | null
    databaseDataStorage: ClientDatabaseDataStorage | null
    FlightModel: mongoose.Model<MongoDbFlightSchema>
} & typeof global

globalThis.vatsimDataStorage = null
globalThis.databaseDataStorage = null

export default globalThis