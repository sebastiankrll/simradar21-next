import { updateGeneral } from "@/server/services/vatsim/general";
import { updatePosition } from "@/server/services/vatsim/position";
import { updateTrack } from "@/server/services/vatsim/track";
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
    track: null,
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
    updateTrack()
}