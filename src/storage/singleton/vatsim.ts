import { updateGeneral } from "@/server/services/vatsim/general";
import { updatePosition } from "@/server/services/vatsim/position";
import { updateTrack } from "@/server/services/vatsim/track";
import { updateStatus } from "@/server/services/vatsim/status";
import { updateController } from "@/server/services/vatsim/controller";
import { VatsimDataStorage, RawDataStorage } from "@/types/vatsim";
import { VatsimDataWS } from "@/types/vatsim";
import { updateAirport } from "@/server/services/vatsim/airport";
import { updateDb } from "../database";

export const rawDataStorage: RawDataStorage = {
    vatsim: null,
    transveivers: null
}

export let vatsimDataStorage: VatsimDataStorage = {
    position: [],
    general: [],
    status: [],
    generalPre: [],
    statusPre: [],
    track: [],
    controller: null,
    airport: [],
    timestamp: new Date()
}

export function setVatsimStorage(data: VatsimDataStorage) {
    vatsimDataStorage = data
}

export function updateVatsimStorage() {
    updatePosition()
    updateGeneral()
    updateStatus()
    updateTrack()
    updateController()
    updateAirport()
    updateDb()
}

export function getVatsimWsData(): VatsimDataWS | null {
    return {
        flights: vatsimDataStorage.position,
        controllers: vatsimDataStorage.controller,
        timestamp: vatsimDataStorage.timestamp
    }
}