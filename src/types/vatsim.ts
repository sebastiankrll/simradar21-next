import { Feature, GeoJsonProperties, Point } from "geojson"

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

export interface RawDataStorage {
    vatsim: null | VatsimData,
    transveivers: null | VatsimTransceiversData[]
}

export interface VatsimStoragePositionAirline {
    iata: string,
    bg?: string,
    font?: string
}

export interface VatsimStoragePositionData {
    callsign: string,
    aircraft: string | null,
    coordinates: number[],
    altitudes: number[],
    heading: number,
    groundspeeds: number[],
    frequency: string,
    airports: string[] | null,
    airline: VatsimStoragePositionAirline,
    type: number,
    connected: boolean,
    timestamp: Date
}

export interface VatsimStorageGeneralIndex {
    hash: string | null,
    cid: number,
    callsign: string,
    name: string,
    rating?: string,
    server?: string,
}

export interface VatsimStorageGeneralAirport {
    dep: Feature<Point, GeoJsonProperties>,
    arr: Feature<Point, GeoJsonProperties>
}

export interface VatsimStorageGeneralFlightPlan {
    filedSpeed: number,
    filedLevel: number,
    depTime: Date | null,
    enrouteTime: number,
    dist: number,
    plan: string,
    remarks: string,
    rules: string
}

export interface VatsimStorageGeneralAircraft {
    icao: string,
    type: string,
    registration?: string,
    country: string,
    msn?: string,
    age?: number
}

export interface VatsimStorageGeneralAirline {
    icao: string,
    iata: string,
    name: string,
    flightno: string,
    bg?: string,
    font?: string
}

export interface VatsimStorageGeneralData {
    index: VatsimStorageGeneralIndex,
    airport: VatsimStorageGeneralAirport | null,
    flightplan: VatsimStorageGeneralFlightPlan | null,
    aircraft: VatsimStorageGeneralAircraft | null,
    airline: VatsimStorageGeneralAirline
}

export interface VatsimStorageStatusIndex {
    hash: string | null,
    callsign: string,
    transponder?: string,
    altimeters?: number,
    altitude: number
}

export interface VatsimStorageStatusProgress {
    status: string,
    stops: 0,
    depDist: number,
    arrDist: number
}

export interface VatsimStorageStatusTimes {
    offBlock: Date,
    schedDep: Date,
    actDep: Date,
    schedArr: Date,
    actArr: Date,
    onBlock: Date
}

export interface VatsimStorageStatusData {
    index: VatsimStorageStatusIndex,
    progress: VatsimStorageStatusProgress,
    times: VatsimStorageStatusTimes
}

export interface VatsimStorageTrackPoint {
    coordinates: number[],
    altitudes: number[],
    groundspeed: number,
    connected: boolean,
    timestamp: Date
}

export interface VatsimStorageTrackData {
    callsign: string,
    points: VatsimStorageTrackPoint[]
}

export interface VatsimStorageControllerIndex {
    callsign: string,
    type: string,
    facility: number,
    frequency: string,
    text: string[] | null,
    connections: number,
    logon: Date
}

export interface VatsimStorageControllerData {
    airports: { [key: string]: VatsimStorageControllerIndex[] },
    firs: { [key: string]: VatsimStorageControllerIndex[] },
    tracons: { [key: string]: VatsimStorageControllerIndex[] }
}

export interface VatsimStorageAirportData {
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
    positions: VatsimStoragePositionData[],
    generals: VatsimStorageGeneralData[],
    statuss: VatsimStorageStatusData[],
    generalPres: VatsimStorageGeneralData[],
    statusPres: VatsimStorageStatusData[],
    tracks: VatsimStorageTrackData[],
    controllers: VatsimStorageControllerData | null,
    airports: VatsimStorageAirportData[]
    timestamp: Date
}

export interface VatsimMinimalData {
    positions: VatsimStoragePositionData[] | null,
    controllers: VatsimStorageControllerData | null,
    timestamp: Date
}

export interface VatsimFlightData {
    position: VatsimStoragePositionData | null,
    general: VatsimStorageGeneralData | null,
    status: VatsimStorageStatusData | null
}

export interface VatsimAirportFlightData {
    general: VatsimStorageGeneralData,
    status: VatsimStorageStatusData,
    completed: boolean
}