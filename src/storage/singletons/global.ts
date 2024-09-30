import { FlightData } from "@/types/flight";
import { TrackData, VatsimDataStorage, VatsimDataWS } from "@/types/vatsim";

export function setGlobalVatsimStorage(data: VatsimDataStorage) {
    globalThis.vatsimDataStorage = data
}

export function getFlightData(callsign: string): FlightData {
    const position = globalThis.vatsimDataStorage?.position?.find(pilot => pilot.callsign === callsign) ?? null
    const general = globalThis.vatsimDataStorage?.general?.find(pilot => pilot.index.callsign === callsign) ?? null
    const status = globalThis.vatsimDataStorage?.status?.find(pilot => pilot.index.callsign === callsign) ?? null

    return {
        position: position,
        general: general,
        status: status
    }
}

export function getTrackData(callsign: string): TrackData | null {
    return globalThis.vatsimDataStorage?.track?.find(pilot => pilot.callsign === callsign) ?? null
}

export function getWsData(): VatsimDataWS | null {
    if (!globalThis.vatsimDataStorage) return null

    return {
        position: globalThis.vatsimDataStorage.position,
        timestamp: globalThis.vatsimDataStorage.timestamp
    }
}

declare const globalThis: {
    vatsimDataStorage: VatsimDataStorage | null
} & typeof global