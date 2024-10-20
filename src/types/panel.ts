import { GeneralData, StatusData } from "./vatsim"

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

export interface PanelStates {
    [key: string]: boolean
}

export interface FlightsSearchParam {
    pagination: string,
    icao: string,
    direction: string,
    timestamp: Date,
    n: number
}

export interface AirportFlight {
    general: GeneralData,
    status: StatusData
}