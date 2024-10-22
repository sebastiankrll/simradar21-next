import { DatabaseDataStorage, MongoFlightSchema } from "@/types/database"
import { VatsimDataStorage } from "@/types/vatsim"
import mongoose from "mongoose"

declare const globalThis: {
    vatsimDataStorage: VatsimDataStorage | null
    databaseDataStorage: DatabaseDataStorage | null
    FlightModel: mongoose.Model<MongoFlightSchema>
} & typeof global

globalThis.vatsimDataStorage = null
globalThis.databaseDataStorage = null

export default globalThis