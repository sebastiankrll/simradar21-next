import { VatsimDataStorage, VatsimDataWS } from "@/types/vatsim";

export function setGlobalVatsimStorage(data: VatsimDataStorage) {
    globalThis.vatsimDataStorage = data
}

export function getGlobalVatsimStorage() {
    return structuredClone(globalThis.vatsimDataStorage)
}

export function getVatsimDataWs(): VatsimDataWS | null {
    if (!globalThis.vatsimDataStorage) return null

    const storage = structuredClone(globalThis.vatsimDataStorage)
    return {
        position: storage.position,
        timestamp: storage.timestamp
    } as VatsimDataWS
}

declare const globalThis: {
    vatsimDataStorage: VatsimDataStorage
} & typeof global