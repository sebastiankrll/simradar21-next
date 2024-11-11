import { VatsimStorageAirportData, VatsimStorageGeneralData, VatsimStoragePositionData, VatsimStorageStatusData } from "./vatsim"

export interface AirportPanelWeather {
    condition: string,
    temperature: string,
    dewPoint: string,
    wind: string,
    altimeters: string,
    raw: string
}

export interface AirportPanelTimezone {
    abbreviation: string,
    utc_offset: string,
}

export interface AirportPanelData {
    data: VatsimStorageAirportData | null,
    weather: AirportPanelWeather | null,
    timezone: AirportPanelTimezone | null
}

export interface AirportPanelFlightsSearchParams {
    pagination: string,
    icao: string,
    direction: string,
    timestamp: Date,
    n: number
}

export interface FlightPanelLiveData {
    altitude: number,
    radar: number,
    groundspeed: number,
    heading: number,
    fpm: string
}

export interface FlightPanelStatusData {
    callsign: string | undefined,
    depStatus: string,
    arrStatus: string,
    delayColor: string,
    imgOffset: number,
    progress: number,
    startToEnd: string[]
}

export type PanelStates = Record<string, boolean>