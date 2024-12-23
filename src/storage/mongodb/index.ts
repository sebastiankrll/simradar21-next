import mongoose, { AnyBulkWriteOperation, DeleteOneModel, UpdateOneModel } from "mongoose"
import { vatsimDataStorage } from "../backend/vatsim"
import FlightSchema from "./schema/Flight"
import { MongoDbFlightSchema } from "@/types/database"

const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/flights')
conn.on('error', console.error.bind(console, 'MongoDB connection error:'))
conn.on('connected', () => console.log('Connected to mongodb: flights'))
conn.dropCollection('flights')
conn.createCollection('flights')

const Flight = conn.model<MongoDbFlightSchema>('Flight', FlightSchema)

export function updateDb() {
    updateFlights()
}

let updateInProgress = false
let prevPrefileHashes: string[] = []

async function updateFlights() {
    if (updateInProgress) return
    updateInProgress = true

    const bulkOps: AnyBulkWriteOperation<UpdateOneModel | DeleteOneModel>[] = []
    const now = Date.now()

    for (const general of vatsimDataStorage.generals) {
        const status = vatsimDataStorage.statuss.find(status => status.index.hash === general.index.hash)

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

    const newPrefileHashes = vatsimDataStorage.generalPres.map(prefile => `${prefile.index.callsign}_${prefile.index.hash}`)
    const removedPrefileHashes = prevPrefileHashes.filter(hash => !newPrefileHashes.includes(hash))
    prevPrefileHashes = newPrefileHashes

    for (const prefileHash of removedPrefileHashes) {
        bulkOps.push({
            deleteOne: {
                filter: { hash: prefileHash }
            }
        })
    }

    for (const general of vatsimDataStorage.generalPres) {
        const status = vatsimDataStorage.statusPres.find(status => status.index.hash === general.index.hash)

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