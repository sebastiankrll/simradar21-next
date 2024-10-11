import airportsJSON from '@/assets/data/airports_short.json'
import { DatabaseDataStorage } from '@/types/misc'
import { FeatureCollection, Point } from 'geojson'
import globalThis from './global'

const airports = airportsJSON as FeatureCollection<Point>

export let databaseDataStorage: DatabaseDataStorage = {
    airports: {
        version: "",
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

export function setDatabaseStorage(data: DatabaseDataStorage) {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        globalThis.databaseDataStorage = data
        return
    }
    databaseDataStorage = data
}

export async function updateDatabaseStorage(): Promise<boolean> {
    let updated = false
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

    return updated = true
}