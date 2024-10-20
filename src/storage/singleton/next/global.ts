import { DatabaseDataStorage } from "@/types/database"
import { VatsimDataStorage } from "@/types/vatsim"

declare const globalThis: {
    vatsimDataStorage: VatsimDataStorage
    databaseDataStorage: DatabaseDataStorage
} & typeof global

globalThis.vatsimDataStorage = {
    position: [],
    general: [],
    status: [],
    generalPre: [],
    statusPre: [],
    track: [],
    controller: null,
    airport: [],
    timestamp: new Date()
}

globalThis.databaseDataStorage = {
    airports: {
        version: "",
        data: null
    },
    firs: {
        version: "",
        data: null
    },
    tracons: {
        version: "",
        data: null
    }
}

export default globalThis