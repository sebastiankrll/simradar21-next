import { MongoDbFlightSchema } from "@/types/database"
import { Schema } from "mongoose"

const FlightSchema: Schema = new Schema<MongoDbFlightSchema>({
    hash: String,
    general: Object,
    status: Object,
    createdAt: { type: Date, expires: 60 * 60 }
}, {
    autoCreate: false,
})

FlightSchema.index({ hash: 1 })
FlightSchema.index({ 'general.airport.dep.properties.icao': 1, 'status.times.schedDep': 1 })
FlightSchema.index({ 'general.airport.arr.properties.icao': 1, 'status.times.schedArr': 1 })

export default FlightSchema