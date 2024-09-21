import { updateGeneral } from "@/server/services/vatsim/general";
import { updatePosition } from "@/server/services/vatsim/position";
import { updateRoute } from "@/server/services/vatsim/route";
import { updateStatus } from "@/server/services/vatsim/status";
import { VatsimDataStorage, RawDataStorage } from "@/types/vatsim";
import { VatsimDataWS } from "@/types/vatsim";

let rawDataStorage: RawDataStorage = {
    vatsim: null,
    transveivers: null
}

export function setRawStorage(data: RawDataStorage) {
    rawDataStorage = data
}

export function getRawStorage() {
    return structuredClone(rawDataStorage)
}

let vatsimDataStorage: VatsimDataStorage = {
    position: null,
    general: null,
    status: null,
    generalPre: null,
    statusPre: null,
    route: null,
    timestamp: new Date()
}

export function setVatsimStorage(data: VatsimDataStorage) {
    vatsimDataStorage = data
}

export function getVatsimStorage() {
    return structuredClone(vatsimDataStorage)
}

export function getVatsimDataWs() {
    const storage = structuredClone(vatsimDataStorage)
    return {
        position: storage.position,
        timestamp: storage.timestamp
    } as VatsimDataWS
}

export function updateVatsimStorage() {
    updatePosition()
    updateGeneral()
    updateStatus()
    updateRoute()
}