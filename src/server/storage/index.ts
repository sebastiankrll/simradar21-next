import { PositionData, GeneralData, VatsimData, VatsimTransceiversData, StatusData, RouteData } from "@/types/data/vatsim";
import { updatePosition } from "../services/vatsim/position";
import { updateGeneral } from "../services/vatsim/general";
import { updateStatus } from "../services/vatsim/status";
import { updateRoute } from "../services/vatsim/route";

export const rawDataStorage = {
    vatsim: null as null | VatsimData,
    transveivers: null as null | VatsimTransceiversData[]
}

export const vatsimDataStorage = {
    position: null as null | PositionData[],
    general: null as null | GeneralData[],
    status: null as null | StatusData[],
    generalPre: null as null | GeneralData[],
    statusPre: null as null | StatusData[],
    route: null as null | RouteData[],
    timestamp: null as null | Date
}

export function updateVatsimStorage() {
    updatePosition()
    updateGeneral()
    updateStatus()
    updateRoute()
}