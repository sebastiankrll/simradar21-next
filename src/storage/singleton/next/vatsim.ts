import { VatsimDataStorage, TrackData, FlightData, AirportData } from "@/types/vatsim";
import { VatsimDataWS } from "@/types/vatsim";
import globalThis from "./global";

export function setVatsimStorage(data: VatsimDataStorage) {
    globalThis.vatsimDataStorage = data
}

export function getVatsimFlightData(callsign: string): FlightData {
    const position = globalThis.vatsimDataStorage?.position?.find(pilot => pilot.callsign === callsign) ?? null
    const general = globalThis.vatsimDataStorage?.general?.find(pilot => pilot.index.callsign === callsign) ?? null
    const status = globalThis.vatsimDataStorage?.status?.find(pilot => pilot.index.callsign === callsign) ?? null

    return {
        position: position,
        general: general,
        status: status
    }
}

export function getVatsimTrackData(callsign: string): TrackData | null {
    return globalThis.vatsimDataStorage?.track?.find(pilot => pilot.callsign === callsign) ?? null
}

export function getVatsimAirportData(icao: string): AirportData | null {
    return globalThis.vatsimDataStorage?.airport?.find(airport => airport.icao === icao) ?? null
}

export function getVatsimWsData(): VatsimDataWS | null {
    if (!globalThis.vatsimDataStorage) return null

    return {
        flights: globalThis.vatsimDataStorage.position,
        controllers: globalThis.vatsimDataStorage.controller,
        timestamp: globalThis.vatsimDataStorage.timestamp
    }
}