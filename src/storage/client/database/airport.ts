import { ClientDatabaseDataStorage, IndexedDBData, IndexedDBVersion } from "@/types/database"
import Dexie, { EntityTable } from "dexie"
import { Point } from "geojson"

export const dbAirport = new Dexie("Airports") as Dexie & {
    data: EntityTable<
        IndexedDBData<Point>,
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

export async function insertAirports(newData: ClientDatabaseDataStorage) {
    const inserts: IndexedDBData<Point>[] = []
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