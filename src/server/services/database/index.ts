import { databaseDataStorage, updateDatabaseStorage } from '@/storage/singletons/database'
import { Redis } from 'ioredis'

const redisPub = new Redis()

let dataUpdateInProgress = false

export async function updateDatabaseData() {
    if (dataUpdateInProgress) return

    dataUpdateInProgress = true

    const updated = await updateDatabaseStorage()
    if (updated) {
        redisPub.publish('database_storage', JSON.stringify(databaseDataStorage))
        redisPub.set('database_storage', JSON.stringify(databaseDataStorage))
        console.log(new Date().toISOString() + ': Database data updated.')
    }

    dataUpdateInProgress = false
}