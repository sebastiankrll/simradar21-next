import { updateGeneral } from "@/backend/services/vatsim/general";
import { updatePosition } from "@/backend/services/vatsim/position";
import { updateTrack } from "@/backend/services/vatsim/track";
import { updateStatus } from "@/backend/services/vatsim/status";
import { updateController } from "@/backend/services/vatsim/controller";
import { VatsimDataStorage, RawDataStorage, VatsimMinimalData } from "@/types/vatsim";
import { updateAirport } from "@/backend/services/vatsim/airport";
import { updateDb } from "../mongodb";

export const rawDataStorage: RawDataStorage = {
    vatsim: null,
    transveivers: null
}

export let vatsimDataStorage: VatsimDataStorage = {
    positions: [],
    generals: [],
    statuss: [],
    generalPres: [],
    statusPres: [],
    tracks: [],
    controllers: null,
    airports: [],
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

export function getVatsimWsData(): VatsimMinimalData | null {
    return {
        positions: vatsimDataStorage.positions,
        controllers: vatsimDataStorage.controllers,
        timestamp: vatsimDataStorage.timestamp
    }
}