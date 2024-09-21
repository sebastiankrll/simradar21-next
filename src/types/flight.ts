import { GeneralData, PositionData, StatusData } from "./vatsim";

export interface FlightData {
    position: PositionData | null,
    general: GeneralData | null,
    status: StatusData | null
}

export interface LiveFlightData {
    altitude: number,
    radar: number,
    groundspeed: number,
    heading: number,
    fpm: string
}

export interface StatusFlightData {
    depStatus: string,
    arrStatus: string,
    delayColor: string,
    svg: string,
    progress: number,
    startToEnd: string[]
}