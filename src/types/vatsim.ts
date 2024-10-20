import { Feature, GeoJsonProperties, Point } from "geojson"
import { IMetar } from "metar-taf-parser"

export interface VatsimGeneral {
    version: number
    update: number
    connected_clients: number
    unique_users: number
    supsCount: number
    admCount: number
    onlineWSUsers: number
}

export interface VatsimPilot {
    cid: number
    name: string
    callsign: string
    server: string
    pilot_rating: number
    military_rating: number
    latitude: number
    longitude: number
    altitude: number
    groundspeed: number
    transponder: string
    heading: number
    qnh_i_hg: number
    qnh_mb: number
    flight_plan?: VatsimPilotFlightPlan
    logon_time: string
    last_updated: string
    frequencies: string[]
}

export type VatsimPilotFlightPlan = Partial<{
    flight_rules: 'I' | 'V' | 'S'
    aircraft: string
    aircraft_faa: string
    aircraft_short: string
    departure: string
    cruise_tas: string
    altitude: string
    arrival: string
    alternate: string
    deptime: string
    enroute_time: string
    fuel_time: string
    remarks: string
    route: string
    revision_id: number
    assigned_transponder: string
}>

export interface VatsimController {
    cid: number
    name: string
    callsign: string
    frequency: string
    facility: number
    rating: number
    server: string
    visual_range: number
    text_atis: string[] | null
    last_updated: string
    logon_time: string
}

export interface VatsimATIS extends VatsimController {
    isATIS?: boolean
    atis_code?: string
}

export interface VatsimServers {
    ident: string
    hostname_or_ip: string
    location: string
    name: string
    client_connections_allowed: boolean
    is_sweatbox: boolean
}

export interface VatsimPrefile {
    cid: number
    name: string
    callsign: string
    flight_plan: VatsimPilotFlightPlan
    last_updated: string
}

export interface VatsimInfoDefault {
    id: number
}

export interface VatsimInfoLong extends VatsimInfoDefault {
    short: string
    long: string
}

export interface VatsimInfoLongName extends VatsimInfoDefault {
    short_name: string
    long_name: string
}

export interface VatsimTransceiver {
    id: string,
    frequency: number,
    latDeg: number,
    lonDeg: number,
    heightMslM: number,
    heightAglM: number
}

export interface VatsimTransceiversData {
    callsign: string,
    transceivers: VatsimTransceiver[]
}

export interface VatsimData {
    general: VatsimGeneral
    pilots: VatsimPilot[]
    controllers: VatsimController[]
    atis: VatsimATIS[]
    servers: VatsimServers[]
    prefiles: VatsimPrefile[]
    facilities: VatsimInfoLong[]
    ratings: VatsimInfoLong[]
    pilot_ratings: VatsimInfoLongName[]
    military_ratings: VatsimInfoLongName[]
    transceivers: VatsimTransceiversData[]
}

export interface PositionData {
    callsign: string,
    aircraft: string | null,
    coordinates: number[],
    altitudes: number[],
    heading: number,
    groundspeeds: number[],
    frequency: string,
    airports: string[] | null,
    airline: string | null,
    type: number,
    connected: boolean,
    timestamp: Date
}

export interface GeneralIndex {
    hash: string | null,
    cid: number,
    callsign: string,
    name: string,
    rating?: string,
    server?: string,
}

export interface GeneralAirport {
    dep: Feature<Point, GeoJsonProperties>,
    arr: Feature<Point, GeoJsonProperties>
}

export interface GeneralFlightPlan {
    filedSpeed: number,
    filedLevel: number,
    depTime: Date | null,
    enrouteTime: number,
    dist: number,
    plan: string,
    remarks: string,
    rules: string
}

export interface GeneralAircraft {
    icao: string,
    type: string,
    registration?: string,
    country: string,
    msn?: string,
    age?: number
}

export interface GeneralAirline {
    icao: string,
    iata: string,
    name: string,
    flightno: string
}

export interface GeneralData {
    index: GeneralIndex,
    airport: GeneralAirport | null,
    flightplan: GeneralFlightPlan | null,
    aircraft: GeneralAircraft | null,
    airline: GeneralAirline
}

export interface StatusIndex {
    hash: string | null,
    callsign: string,
    transponder?: string,
    altimeters?: number,
    altitude: number
}

export interface StatusProgress {
    status: string,
    stops: 0,
    depDist: number,
    arrDist: number
}

export interface StatusTimes {
    offBlock: Date,
    schedDep: Date,
    actDep: Date,
    schedArr: Date,
    actArr: Date,
    onBlock: Date
}

export interface StatusData {
    index: StatusIndex,
    progress: StatusProgress,
    times: StatusTimes
}

export interface TrackPoint {
    coordinates: number[],
    altitudes: number[],
    groundspeed: number,
    connected: boolean,
    timestamp: Date
}

export interface TrackData {
    callsign: string,
    points: TrackPoint[]
}

export interface ControllerIndex {
    callsign: string,
    type: string,
    facility: number,
    frequency: string,
    text: string[] | null,
    logon: Date
}

export interface ControllerData {
    [key: string]: ControllerIndex[]
}

export interface AirportData {
    icao: string,
    departures: {
        n: number,
        tDelay: number,
        nDelay: number
    },
    arrivals: {
        n: number,
        tDelay: number,
        nDelay: number
    },
    busiest: string,
    connections: number,
    routes?: Map<string, number>
}

export interface VatsimDataStorage {
    position: PositionData[],
    general: GeneralData[],
    status: StatusData[],
    generalPre: GeneralData[],
    statusPre: StatusData[],
    track: TrackData[],
    controller: ControllerData | null,
    airport: AirportData[]
    timestamp: Date
}

export interface VatsimDisconnected {
    position: PositionData[],
    general: GeneralData[],
    status: StatusData[],
    track: TrackData[]
}

export interface VatsimDataWS {
    flights: PositionData[] | null,
    controllers: ControllerData | null,
    timestamp: Date
}

export interface RawDataStorage {
    vatsim: null | VatsimData,
    transveivers: null | VatsimTransceiversData[]
}

export interface FlightData {
    position: PositionData | null,
    general: GeneralData | null,
    status: StatusData | null,
    track?: TrackData | null
}

export interface AirportWeather {
    condition: string,
    temperature: string,
    dewPoint: string,
    wind: string,
    altimeters: string,
    raw: string
}

export interface AirportTimezone {
    abbreviation: string,
    utc_offset: string,
}

export interface AirportAPIData {
    data: AirportData | null,
    weather: AirportWeather | null,
    timezone: AirportTimezone | null
}