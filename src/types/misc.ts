import { VatsimDataWS } from "./vatsim"

export interface Aircrafts {
    [key: string]: number
}

export interface Fleet {
    built?: string,
    country?: string,
    operatorIcao?: string,
    registration?: string,
    serialNumber?: string,
    typecode?: string,
    model?: string
}

export interface Airlines {
    id?: string,
    name?: string,
    alias?: string,
    iata?: string,
    icao?: string,
    callsign?: string,
    country?: string,
    active?: string
}

export interface WsMessage {
    event: string,
    data: VatsimDataWS
}

export interface PanelStates {
    [key: string]: boolean
}