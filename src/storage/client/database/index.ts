import { fetcher } from "@/utils/api/api";
import { dbAirport, insertAirports } from "./airport";
// import { dbFir, insertFIRs } from "./fir";
// import { dbTracon, insertTRACONs } from "./tracon";
import { Feature, Point } from "geojson";
import { ClientDatabaseAirports, ClientDatabaseDataStorage } from "@/types/database";

let dbReady: boolean = false
let dbPromise: Promise<void> | null = null

export async function checkAndUpdateData() {
    const storedLastDbCheck = localStorage.getItem('LAST_DB_CHECK')
    if (storedLastDbCheck && new Date(JSON.parse(storedLastDbCheck)).getTime() > Date.now() - 1000 * 60 * 60 * 24) return

    dbPromise = new Promise<void>(async (resolve, reject) => {
        try {
            const airportVersion = await dbAirport.versions.get(1)
            // const firVersion = await dbFir.versions.get(1)
            // const traconVersion = await dbTracon.versions.get(1)

            const versions = await fetcher('/api/database/versions') as ClientDatabaseDataStorage | null

            if (versions && versions.airports.version !== airportVersion?.version) {
                const data = await fetcher('/api/database/airports') as ClientDatabaseAirports | null
                await insertAirports(data)
            }

            // if (versions && versions.firs.version !== firVersion?.version) {
            //     const data = await fetcher('/api/database/firs') as ClientDatabaseSectors | null
            //     await insertFIRs(data)
            // }

            // if (versions && versions.tracons.version !== traconVersion?.version) {
            //     const data = await fetcher('/api/database/tracons') as ClientDatabaseSectors | null
            //     await insertTRACONs(data)
            // }
            
            localStorage.setItem('LAST_DB_CHECK', JSON.stringify(Date.now()))
            resolve()
        } catch (error) {
            console.error("Error during data migration:", error)
            reject(error)
        }
    })

    await dbPromise
    dbReady = true
}

export async function getAllAirports(): Promise<Feature<Point>[] | null> {
    if (!dbReady) {
        await dbPromise
    }

    return dbAirport.data.toArray().then(data => {
        return data.map(entry => entry.feature)
    })
}

export async function getSelectedAirports(icaos: string[]): Promise<Feature<Point>[] | null> {
    if (!dbReady) {
        await dbPromise
    }

    return dbAirport.data.where('icao').anyOf(icaos).toArray().then(data => {
        return data.map(entry => entry.feature)
    })
}