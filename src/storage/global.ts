import { MongoDbFlightSchema } from "@/types/database"
import { VatsimDataStorage } from "@/types/vatsim"
import Redis from "ioredis"
import mongoose from "mongoose"

declare const globalThis: {
    vatsimDataStorage: VatsimDataStorage | null
    FlightModel: mongoose.Model<MongoDbFlightSchema>
    redisGet: Redis
} & typeof global

export default globalThis