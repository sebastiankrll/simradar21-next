import { VatsimDataStorage, VatsimFlightData, VatsimMinimalData, VatsimStorageAirportData, VatsimStorageTrackData } from "@/types/vatsim";
import globalThis from "./global";

export function setVatsimStorage(data: VatsimDataStorage) {
    globalThis.vatsimDataStorage = data
}

export function getVatsimFlightData(callsign: string): VatsimFlightData {
    const position = globalThis.vatsimDataStorage?.positions?.find(pilot => pilot.callsign === callsign) ?? null
    const general = globalThis.vatsimDataStorage?.generals?.find(pilot => pilot.index.callsign === callsign) ?? null
    const status = globalThis.vatsimDataStorage?.statuss?.find(pilot => pilot.index.callsign === callsign) ?? null

    return {
        position: position,
        general: general,
        status: status
    }
}

export function getVatsimTrackData(callsign: string): VatsimStorageTrackData | null {
    return globalThis.vatsimDataStorage?.tracks?.find(pilot => pilot.callsign === callsign) ?? null
}

export function getVatsimAirportData(icao: string): VatsimStorageAirportData | null {
    return globalThis.vatsimDataStorage?.airports?.find(airport => airport.icao === icao) ?? null
}

export function getVatsimWsData(): VatsimMinimalData | null {
    if (!globalThis.vatsimDataStorage) return null

    return {
        positions: globalThis.vatsimDataStorage.positions,
        controllers: globalThis.vatsimDataStorage.controllers,
        timestamp: globalThis.vatsimDataStorage.timestamp
    }
}