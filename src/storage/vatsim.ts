import { updateGeneral } from "@/server/services/vatsim/general";
import { updatePosition } from "@/server/services/vatsim/position";
import { updateRoute } from "@/server/services/vatsim/route";
import { updateStatus } from "@/server/services/vatsim/status";
import { VatsimDataStorage, RawDataStorage } from "@/types/data/vatsim";

const rawDataStorage: RawDataStorage = {
    vatsim: null,
    transveivers: null
}

export function setRawStorage(data: RawDataStorage) {
    Object.assign(rawDataStorage, data)
}

export function getRawStorage() {
    return structuredClone(rawDataStorage)
}

const vatsimDataStorage: VatsimDataStorage = {
    position: null,
    general: null,
    status: null,
    generalPre: null,
    statusPre: null,
    route: null,
    timestamp: null
}

export function setVatsimStorage(data: VatsimDataStorage) {
    Object.assign(vatsimDataStorage, data)
}

export function getVatsimStorage() {
    return structuredClone(vatsimDataStorage)
}

export function updateVatsimStorage() {
    updatePosition()
    updateGeneral()
    updateStatus()
    updateRoute()
}