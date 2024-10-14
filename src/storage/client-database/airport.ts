import { DatabaseDataStorage, IndexedDBData, IndexedDBVersion } from "@/types/database"
import Dexie, { EntityTable } from "dexie"

export const dbAirport = new Dexie("Airports") as Dexie & {
    data: EntityTable<
        IndexedDBData,
        'id'
    >
    versions: EntityTable<
        IndexedDBVersion,
        'id'
    >
}

dbAirport.version(1).stores({
    data: "id, icao",
    versions: "id"
})

export async function insertAirports(newData: DatabaseDataStorage) {
    const inserts: IndexedDBData[] = []
    newData.airports.data?.forEach(feature => {
        if (feature.id && feature.properties) {
            inserts.push({
                id: typeof feature.id === 'string' ? parseInt(feature.id) : feature.id,
                icao: feature.properties.icao,
                feature: feature
            })
        }
    })

    await dbAirport.data.bulkPut(inserts)
    await dbAirport.versions.put({ id: 1, version: newData.airports.version })
}

// export async function getAllAirports(): Promise<Feature<Point, GeoJsonProperties>[] | Feature<MultiPolygon, GeoJsonProperties>[] | null> {
//     if (!dbReady) {
//         await dbPromise
//     }

//     return db.airports.get(1).then(data => {
//         return data?.data ?? null
//     })
// }

// export async function getSelectedAirports(): Promise<Feature<Point, GeoJsonProperties>[] | Feature<MultiPolygon, GeoJsonProperties>[] | null> {
//     if (!dbReady) {
//         await dbPromise
//     }

//     return db.airports.get(1).then(data => {
//         return data?.data ?? null
//     })
// }