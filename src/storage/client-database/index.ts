import { DatabaseDataStorage } from "@/types/database";
import { fetcher } from "@/utils/api";
import { dbAirport, insertAirports } from "./airport";
import { dbFir, insertFIRs } from "./fir";
import { dbTracon, insertTRACONs } from "./tracon";
import { Feature, Point } from "geojson";

let dbReady: boolean = false
let dbPromise: Promise<void> | null = null

export async function checkAndUpdateData(versionData: DatabaseDataStorage) {
    dbPromise = new Promise<void>(async (resolve, reject) => {
        try {
            // const now = Date.now()
            const airportVersion = await dbAirport.versions.get(1)
            const firVersion = await dbFir.versions.get(1)
            const traconVersion = await dbTracon.versions.get(1)

            const isOutdated =
                (!airportVersion || airportVersion.version < versionData.airports.version) ||
                (!firVersion || firVersion.version < versionData.firs.version) ||
                (!traconVersion || traconVersion.version < versionData.tracons.version)


            if (isOutdated) {
                const newData: DatabaseDataStorage = await fetcher('/api/database')
                if ((!airportVersion || airportVersion.version < versionData.airports.version)) {
                    await insertAirports(newData)
                }
                if ((!firVersion || firVersion.version < versionData.firs.version)) {
                    await insertFIRs(newData)
                }
                if ((!traconVersion || traconVersion.version < versionData.tracons.version)) {
                    await insertTRACONs(newData)
                }
            }
            // console.log(Math.round(Date.now() - now) + ' ms passed.')
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