import airportsJSON from '@/assets/data/airports_short.json'
import { FeatureCollection, Point } from 'geojson'
import globalThis from './global'
import Redis from 'ioredis'
import { DatabaseDataStorage } from '@/types/database'

const airports = airportsJSON as FeatureCollection<Point>

if (process.env.NEXT_RUNTIME === 'nodejs') {
    const redisGet = new Redis()

    redisGet.get('database_storage', (err, result) => {
        if (err || !result) {
            console.log(`Error getting redis database_storage data: ${err}`)
        } else {
            setDatabaseStorage(JSON.parse(result))
        }
    })

    redisGet.quit()
}

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

export function setDatabaseStorage(data: DatabaseDataStorage) {
    globalThis.databaseDataStorage = data
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

export function getDatabaseStorage(): DatabaseDataStorage {
    return globalThis.databaseDataStorage
}

export function getDatabaseVersions(): DatabaseDataStorage {
    return {
        airports: {
            version: globalThis.databaseDataStorage.airports.version,
            data: null
        },
        firs: {
            version: globalThis.databaseDataStorage.firs.version,
            data: null
        },
        tracons: {
            version: globalThis.databaseDataStorage.tracons.version,
            data: null
        }
    }
}