import { DatabaseDataStorage, IndexedDBData, IndexedDBVersion } from "@/types/database"
import Dexie, { EntityTable } from "dexie"
import { MultiPolygon } from "geojson"

export const dbTracon = new Dexie("TRACONs") as Dexie & {
    data: EntityTable<
        IndexedDBData<MultiPolygon>,
        'id'
    >
    versions: EntityTable<
        IndexedDBVersion,
        'id'
    >
}

dbTracon.version(1).stores({
    data: "id, icao",
    versions: "id"
})

export async function insertTRACONs(newData: DatabaseDataStorage) {
    const inserts: IndexedDBData<MultiPolygon>[] = []
    newData.tracons.data?.forEach(feature => {
        if (feature.id && feature.properties) {
            inserts.push({
                id: typeof feature.id === 'string' ? parseInt(feature.id) : feature.id,
                icao: feature.properties.icao,
                feature: feature
            })
        }
    })

    await dbTracon.data.bulkPut(inserts)
    await dbTracon.versions.put({ id: 1, version: newData.tracons.version })
}