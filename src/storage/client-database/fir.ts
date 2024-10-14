import { DatabaseDataStorage, IndexedDBData, IndexedDBVersion } from "@/types/database"
import Dexie, { EntityTable } from "dexie"

export const dbFir = new Dexie("FIRs") as Dexie & {
    data: EntityTable<
        IndexedDBData,
        'id'
    >
    versions: EntityTable<
        IndexedDBVersion,
        'id'
    >
}

dbFir.version(1).stores({
    data: "id, icao",
    versions: "id"
})

export async function insertFIRs(newData: DatabaseDataStorage) {
    const inserts: IndexedDBData[] = []
    newData.firs.data?.forEach(feature => {
        if (feature.id && feature.properties) {
            inserts.push({
                id: typeof feature.id === 'string' ? parseInt(feature.id) : feature.id,
                icao: feature.properties.icao,
                feature: feature
            })
        }
    })

    await dbFir.data.bulkPut(inserts)
    await dbFir.versions.put({ id: 1, version: newData.firs.version })
}