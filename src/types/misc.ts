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

export interface WorldTimeData {
    utc_offset: string,
    timezone: string,
    day_of_week: number,
    day_of_year: number,
    datetime: string,
    utc_datetime: string,
    unixtime: number,
    raw_offset: number,
    week_number: number,
    dst: boolean,
    abbreviation: string,
    dst_offset: number,
    dst_from: string,
    dst_until: string,
    client_ip: string
}