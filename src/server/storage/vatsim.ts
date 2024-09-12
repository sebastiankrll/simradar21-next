import { VatsimData, VatsimTransceiversData, VatsimDataStorage } from "@/types/data/vatsim";
import { updatePosition } from "../services/vatsim/position";
import { updateGeneral } from "../services/vatsim/general";
import { updateStatus } from "../services/vatsim/status";
import { updateRoute } from "../services/vatsim/route";

export const rawDataStorage = {
    vatsim: null as null | VatsimData,
    transveivers: null as null | VatsimTransceiversData[]
}

export const vatsimDataStorage: VatsimDataStorage = {
    position: null,
    general: null,
    status: null,
    generalPre: null,
    statusPre: null,
    route: null,
    timestamp: null
}

export function updateVatsimStorage() {
    updatePosition()
    updateGeneral()
    updateStatus()
    updateRoute()
}