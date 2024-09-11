import { PositionData, StatusData, VatsimData, VatsimTransceiversData } from "@/types/data/vatsim";

export const rawDataStorage = {
    vatsim: null as null | VatsimData,
    transveivers: null as null | VatsimTransceiversData[]
}

export const vatsimDataStorage = {
    _position: null as null | PositionData[],
    position: null as null | PositionData[],
    status: null as null | StatusData[],
    timestamp: null as null | Date
}