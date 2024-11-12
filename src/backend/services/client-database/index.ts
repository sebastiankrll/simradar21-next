import { Redis } from 'ioredis'
import { ClientDatabaseDataStorage } from '@/types/database'
// import { updateFIRs } from './fir'
// import { updateTRACONs } from './tracon'
import { updateAirports } from './airports'

const redisSet = new Redis()

const databaseDataStorage: ClientDatabaseDataStorage = {
    airports: {
        version: ""
    },
    firs: {
        version: ""
    },
    tracons: {
        version: ""
    }
}

let dataUpdateInProgress = false

export async function updateDatabaseData() {
    if (dataUpdateInProgress) return
    dataUpdateInProgress = true

    const airports = updateAirports(databaseDataStorage.airports.version)
    if (airports.version !== databaseDataStorage.airports.version) {
        databaseDataStorage.airports.version = airports.version
        redisSet.set('CLIENT_DB_AIRPORTS', JSON.stringify(airports))
    }

    // const firs = await updateFIRs(databaseDataStorage.firs.version)
    // if (firs.version !== databaseDataStorage.firs.version) {
    //     databaseDataStorage.firs.version = firs.version
    //     redisSet.set('CLIENT_DB_FIRS', JSON.stringify(firs))
    // }

    // const tracons = await updateTRACONs(databaseDataStorage.tracons.version)
    // if (tracons.version !== databaseDataStorage.tracons.version) {
    //     databaseDataStorage.tracons.version = tracons.version
    //     redisSet.set('CLIENT_DB_TRACONS', JSON.stringify(tracons))
    // }

    redisSet.set('CLIENT_DB_VERSIONS', JSON.stringify(databaseDataStorage))
    
    console.log(new Date().toISOString() + ': Database data updated.')
    dataUpdateInProgress = false
}