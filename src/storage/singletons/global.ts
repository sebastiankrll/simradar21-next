import { DatabaseDataStorage } from "@/types/misc"
import { VatsimDataStorage } from "@/types/vatsim"

declare const globalThis: {
    vatsimDataStorage: VatsimDataStorage
    databaseDataStorage: DatabaseDataStorage
} & typeof global

globalThis.vatsimDataStorage = {
    position: null,
    general: null,
    status: null,
    generalPre: null,
    statusPre: null,
    track: null,
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