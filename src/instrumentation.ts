import { Redis } from "ioredis";
import { setVatsimStorage } from "./storage/singleton/next/vatsim";
import { setDatabaseStorage } from "./storage/singleton/next/database";
import mongoose from "mongoose";
import { MongoFlightSchema } from "./types/database";
import FlightSchema from "./storage/database/schema/Flight";
import globalThis from "./storage/singleton/next/global";

export async function register() {
    const redisSub = new Redis()

    redisSub.subscribe("vatsim_storage", (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message)
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`
            )
        }
    })

    redisSub.subscribe("database_storage", (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message)
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`
            )
        }
    })

    redisSub.on("message", (channel, data) => {
        if (channel === 'vatsim_storage') setVatsimStorage(JSON.parse(data))
        if (channel === 'database_storage') setDatabaseStorage(JSON.parse(data))
    })

    const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/flights')
    conn.on('error', console.error.bind(console, 'MongoDB connection error:'))
    conn.on('connected', () => console.log('Connected to mongodb: flights'))

    globalThis.FlightModel = conn.model<MongoFlightSchema>('Flight', FlightSchema)
}