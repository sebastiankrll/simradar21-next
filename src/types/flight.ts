import { GeneralData, PositionData, StatusData, TrackData } from "./vatsim";

export interface FlightData {
    position: PositionData | null,
    general: GeneralData | null,
    status: StatusData | null,
    track?: TrackData | null
}

export interface LiveFlightData {
    altitude: number,
    radar: number,
    groundspeed: number,
    heading: number,
    fpm: string
}

export interface StatusFlightData {
    callsign: string | undefined,
    depStatus: string,
    arrStatus: string,
    delayColor: string,
    imgOffset: number,
    progress: number,
    startToEnd: string[]
}