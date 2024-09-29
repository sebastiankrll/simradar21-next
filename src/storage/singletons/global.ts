import { VatsimDataStorage } from "@/types/vatsim";

export function setGlobalVatsimStorage(data: VatsimDataStorage) {
    globalThis.vatsimDataStorage = data
}

export function getGlobalVatsimStorage(): VatsimDataStorage | null {
    return structuredClone(globalThis.vatsimDataStorage)
}

declare const globalThis: {
    vatsimDataStorage: VatsimDataStorage
} & typeof global