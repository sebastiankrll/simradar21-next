import { DatabaseClientData, DatabaseDataStorage } from "@/types/database";
import { fetcher } from "@/utils/api";
import Dexie, { EntityTable } from "dexie";
import { Feature, GeoJsonProperties, MultiPolygon, Point } from "geojson";

let dbReady: boolean = false
let dbPromise: Promise<void> | null = null

const db = new Dexie("simradar21") as Dexie & {
    airports: EntityTable<
        DatabaseClientData,
        'id'
    >
    firs: EntityTable<
        DatabaseClientData,
        'id'
    >
    tracons: EntityTable<
        DatabaseClientData,
        'id'
    >
}

db.version(1).stores({
    airports: "id, version, data",
    firs: "id, version, data",
    tracons: "id, version, data"
})

export async function checkAndUpdateData(versionData: DatabaseDataStorage) {
    dbPromise = new Promise<void>(async (resolve, reject) => {
        try {
            // const now = Date.now()
            const airportVersion = await db.airports.get(1)
            const firVersion = await db.firs.get(1)
            const traconVersion = await db.tracons.get(1)

            const isOutdated =
                (!airportVersion || airportVersion.version < versionData.airports.version) ||
                (!firVersion || firVersion.version < versionData.firs.version) ||
                (!traconVersion || traconVersion.version < versionData.tracons.version)


            if (isOutdated) {
                const newData: DatabaseDataStorage = await fetcher('/api/database')
                if ((!airportVersion || airportVersion.version < versionData.airports.version)) {
                    await db.airports.put({ id: 1, version: newData.airports.version, data: newData.airports.data })
                }
                if ((!firVersion || firVersion.version < versionData.firs.version)) {
                    await db.firs.put({ id: 1, version: newData.firs.version, data: newData.firs.data })
                }
                if ((!traconVersion || traconVersion.version < versionData.tracons.version)) {
                    await db.tracons.put({ id: 1, version: newData.tracons.version, data: newData.tracons.data })
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

export async function getAirports(): Promise<Feature<Point, GeoJsonProperties>[] | Feature<MultiPolygon, GeoJsonProperties>[] | null> {
    if (!dbReady) {
        await dbPromise
    }

    return db.airports.get(1).then(data => {
        return data?.data ?? null
    })
} 