import { Schema } from "mongoose"

export const flightSchema: Schema = new Schema({
    hash: String,
    general: Object,
    status: Object,
    createdAt: { type: Date, expires: 60 }
}, {
    autoCreate: false,
})

flightSchema.index({ hash: 1 })
flightSchema.index({ 'general.airport.dep.properties.icao': 1, 'status.times.schedDep': 1 })
flightSchema.index({ 'general.airport.arr.properties.icao': 1, 'status.times.schedArr': 1 })