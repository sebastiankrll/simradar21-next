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
    cs: string,
    ac: string | null,
    co: number[] | null,
    alt: number[],
    hdg: number,
    gs: number[],
    frq: string,
    apt: string[] | null,
    iata: string | null,
    typ: number
}

export interface StatusIndex {
    cid: number,
    callsign: string,
    name: string,
    rating: string,
    server: string,
}

export interface StatusAirport {
    dep: string,
    arr: string
}

export interface StatusFlightPlan {
    plan: string,
    remarks: string,
    rules: string
}

export interface StatusAircraft {
    icao: string,
    type: string,
    registration: string,
    country: string,
    msn: string,
    age: number
}

export interface StatusAirline {
    icao: string,
    iata: string,
    name: string
}

export interface StatusData {
    index: StatusIndex,
    airport?: StatusAirport,
    flightplan?: StatusFlightPlan,
    aircraft?: StatusAircraft,
    airline: StatusAirline
}