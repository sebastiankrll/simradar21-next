import airportsJSON from '@/assets/data/airports_short.json'
import { FeatureCollection, Point } from 'geojson'
import { DatabaseDataStorage } from '@/types/database'

const airports = airportsJSON as FeatureCollection<Point>

export const databaseDataStorage: DatabaseDataStorage = {
    airports: {
        version: "0.1",
        data: airports.features
    },
    firs: {
        version: "",
        data: null
    },
    tracons: {
        version: "",
        data: null
    }
}

export async function updateDatabaseStorage(): Promise<boolean> {
    // let updated = false
    // const firs = await updateFIRs(databaseDataStorage.firs.version)
    // const tracons = await updateTRACONs(databaseDataStorage.tracons.version)

    // if (firs.version !== databaseDataStorage.firs.version) {
    //     databaseDataStorage.firs = firs
    //     updated = true
    // }
    // if (tracons.version !== databaseDataStorage.tracons.version) {
    //     databaseDataStorage.tracons = tracons
    //     updated = true
    // }

    return true
}