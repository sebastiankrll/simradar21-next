import mongoose, { AnyBulkWriteOperation, UpdateOneModel } from "mongoose"
import { vatsimDataStorage } from "../singleton/vatsim"
import { MongoFlightSchema } from "@/types/database"
import FlightSchema from "./schema/Flight"

const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/flights')
conn.on('error', console.error.bind(console, 'MongoDB connection error:'))
conn.on('connected', () => console.log('Connected to mongodb: flights'))
conn.dropCollection('flights')
conn.createCollection('flights')

const Flight = conn.model<MongoFlightSchema>('Flight', FlightSchema)

export function updateDb() {
    updateFlights()
}

let updateInProgress = false

async function updateFlights() {
    if (updateInProgress) return
    updateInProgress = true

    const bulkOps: AnyBulkWriteOperation<UpdateOneModel>[] = []
    const now = Date.now()

    for (const general of vatsimDataStorage.general) {
        const status = vatsimDataStorage.status.find(status => status.index.hash === general.index.hash)

        bulkOps.push({
            updateOne: {
                filter: { hash: `${general.index.callsign}_${general.index.hash}` },
                update: {
                    general: general,
                    status: status,
                    createdAt: now
                },
                upsert: true
            }
        })
    }

    for (const general of vatsimDataStorage.generalPre) {
        const status = vatsimDataStorage.statusPre.find(status => status.index.hash === general.index.hash)

        bulkOps.push({
            updateOne: {
                filter: { hash: `${general.index.callsign}_${general.index.hash}` },
                update: {
                    general: general,
                    status: status,
                    createdAt: now
                },
                upsert: true
            }
        })
    }

    try {
        await Flight.bulkWrite(bulkOps)
    } catch (error) {
        console.error('Error saving airports data to MongoDB:', error)
        throw error
    }

    updateInProgress = false
}