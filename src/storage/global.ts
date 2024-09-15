import { VatsimDataStorage } from "@/types/data/vatsim";

export function setGlobalVatsimStorage(data: VatsimDataStorage) {
    globalThis.vatsimDataStorage = data
    console.log('VATSIM data updated.')
}

export function getGlobalVatsimStorage() {
    return structuredClone(globalThis.vatsimDataStorage)
}

declare const globalThis: {
    vatsimDataStorage: VatsimDataStorage
} & typeof global