import { updateGeneral } from "@/server/services/vatsim/general";
import { updatePosition } from "@/server/services/vatsim/position";
import { updateTrack } from "@/server/services/vatsim/track";
import { updateStatus } from "@/server/services/vatsim/status";
import { VatsimDataStorage, RawDataStorage, TrackData } from "@/types/vatsim";
import { VatsimDataWS } from "@/types/vatsim";
import { FlightData } from "@/types/flight";

declare const globalThis: {
    vatsimDataStorage: VatsimDataStorage
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

export const rawDataStorage: RawDataStorage = {
    vatsim: null,
    transveivers: null
}

export let vatsimDataStorage: VatsimDataStorage = {
    position: null,
    general: null,
    status: null,
    generalPre: null,
    statusPre: null,
    track: null,
    timestamp: new Date()
}

export function setVatsimStorage(data: VatsimDataStorage) {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        globalThis.vatsimDataStorage = data
        return
    }
    vatsimDataStorage = data
}

export function updateVatsimStorage() {
    updatePosition()
    updateGeneral()
    updateStatus()
    updateTrack()
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

export function getVatsimWsData(): VatsimDataWS | null {
    let storage: VatsimDataStorage
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        storage = globalThis.vatsimDataStorage
    } else {
        storage = vatsimDataStorage
    }

    if (!storage) return null

    return {
        flights: {
            position: storage.position
        },
        atc: null,
        timestamp: storage.timestamp
    }
}