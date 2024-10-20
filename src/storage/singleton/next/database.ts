import globalThis from './global'
import Redis from 'ioredis'
import { DatabaseDataStorage } from '@/types/database'

const redisGet = new Redis()
redisGet.get('database_storage', (err, result) => {
    if (err || !result) {
        console.log(`Error getting redis database_storage data: ${err}`)
    } else {
        setDatabaseStorage(JSON.parse(result))
    }
})
redisGet.quit()

export function setDatabaseStorage(data: DatabaseDataStorage) {
    globalThis.databaseDataStorage = data
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