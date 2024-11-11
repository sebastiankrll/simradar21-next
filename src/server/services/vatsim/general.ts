import { rawDataStorage, vatsimDataStorage } from "@/storage/singleton/vatsim"
import { GeneralAircraft, GeneralAirline, GeneralAirport, GeneralData, GeneralFlightPlan, GeneralIndex, VatsimPilot, VatsimPrefile } from "@/types/vatsim"
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson"
import airportsJSON from '@/assets/data/airports_full.json'
import fleetsJSON from '@/assets/data/fleets.json'
import { Airlines, Fleet } from "@/types/misc"
import airlinesJSON from '@/assets/data/airlines.json'
import { calculateDistance, convertVatsimDate } from "@/utils/common"
import { createHash } from "crypto"
import airlineColorsJSON from '@/assets/data/airline_colors.json'

const airlines = airlinesJSON as Airlines[]
const airports = airportsJSON as FeatureCollection
const fleets = fleetsJSON as Fleet[]
const airlineColors = airlineColorsJSON as Record<string, { bg: string, font: string }>

export function updateGeneral() {
    updateGeneralData()
    updateGeneralDataPrefile()
}

export function updateGeneralData() {
    if (!rawDataStorage.vatsim?.pilots || !vatsimDataStorage.position) return

    const newGenerals = []

    for (const position of vatsimDataStorage.position) {
        const prevGeneral = vatsimDataStorage.general?.find(general => general.index.callsign === position.callsign) ?? null
        if (!position.connected && prevGeneral) {
            newGenerals.push(prevGeneral)
            continue
        }

        const pilot = rawDataStorage.vatsim.pilots.find(pilot => pilot.callsign === position.callsign)
        if (!pilot) continue

        const newGeneral: GeneralData = {
            index: getIndexData(pilot),
            airport: getAirportData(pilot),
            flightplan: getFlightPlanData(pilot),
            aircraft: getAircraftData(pilot),
            airline: getAirlineData(pilot)
        }

        if (newGeneral.flightplan && newGeneral.airport) {
            newGeneral.flightplan.dist = calculateDistance(newGeneral.airport.dep.geometry.coordinates, newGeneral.airport.arr.geometry.coordinates)
        }
        generateHash(newGeneral)

        newGenerals.push(newGeneral)
    }

    vatsimDataStorage.general = newGenerals
}

export function updateGeneralDataPrefile() {
    if (!rawDataStorage.vatsim?.prefiles) return

    const newGenerals = []

    for (const prefile of rawDataStorage.vatsim.prefiles) {
        const newGeneral: GeneralData = {
            index: getIndexData(prefile),
            airport: getAirportData(prefile),
            flightplan: getFlightPlanData(prefile),
            aircraft: getAircraftData(prefile),
            airline: getAirlineData(prefile)
        }

        if (newGeneral.flightplan && newGeneral.airport) {
            newGeneral.flightplan.dist = calculateDistance(newGeneral.airport.dep.geometry.coordinates, newGeneral.airport.arr.geometry.coordinates)
        }
        generateHash(newGeneral)

        newGenerals.push(newGeneral)
    }

    vatsimDataStorage.generalPre = newGenerals
}

// function checkSameData(pilot: VatsimPilot, prevGeneral: GeneralData): boolean {
//     const airportsChange = pilot.flight_plan?.departure === prevGeneral.airport?.dep.properties?.icao && pilot.flight_plan?.arrival === prevGeneral.airport?.arr.properties?.icao
//     const flightplanChange = pilot.flight_plan?.route === prevGeneral.flightplan?.plan
//     const cidChange = pilot.cid === prevGeneral.index.cid

//     return airportsChange && flightplanChange && cidChange
// }

function getIndexData(pilot: VatsimPilot | VatsimPrefile): GeneralIndex {
    if ('pilot_rating' in pilot) {
        return {
            hash: null,
            cid: pilot.cid,
            callsign: pilot.callsign,
            name: pilot.name,
            rating: getRating(pilot.pilot_rating),
            server: pilot.server,
        }
    } else {
        return {
            hash: null,
            cid: pilot.cid,
            callsign: pilot.callsign,
            name: pilot.name
        }
    }
}

function getRating(rating: number): string {
    switch (rating) {
        case 0:
            return 'Basic Member'
        case 1:
            return 'PPL'
        case 3:
            return 'IFR'
        case 7:
            return 'CMEL'
        case 15:
            return 'ATPL'
        case 31:
            return 'Instructor'
        case 63:
            return 'Examiner'
        default:
            return 'Unknown'
    }
}

function getAirportData(pilot: VatsimPilot | VatsimPrefile): GeneralAirport | null {
    if (!pilot.flight_plan) return null

    const dep = pilot.flight_plan?.departure ? fetchAirport(pilot.flight_plan.departure) : null
    const arr = pilot.flight_plan?.arrival ? fetchAirport(pilot.flight_plan.arrival) : null

    if (!dep || !arr) return null

    return {
        dep: dep,
        arr: arr
    }
}

function fetchAirport(icao: string): Feature<Point, GeoJsonProperties> {
    const airport = airports.features.find(feature => feature.properties?.icao === icao) as Feature<Point, GeoJsonProperties>
    if (airport) return airport

    return {
        type: 'Feature',
        properties: {
            icao: icao
        },
        geometry: {
            type: 'Point',
            coordinates: []
        }
    }
}

function getFlightPlanData(pilot: VatsimPilot | VatsimPrefile): GeneralFlightPlan | null {
    if (!pilot.flight_plan) return null

    return {
        filedLevel: pilot.flight_plan.altitude ? (/^[0-9]+$/.test(pilot.flight_plan.altitude) ? parseInt(pilot.flight_plan.altitude) : 30000) : 30000,
        filedSpeed: pilot.flight_plan.cruise_tas ? parseInt(pilot.flight_plan.cruise_tas) : 300,
        depTime: pilot.flight_plan.deptime ? convertVatsimDate(pilot.flight_plan.deptime) : null,
        enrouteTime: getEnrouteTime(pilot.flight_plan.enroute_time),
        dist: 0,
        plan: pilot.flight_plan.route ?? '',
        remarks: pilot.flight_plan.remarks ?? '',
        rules: getFlightRule(pilot.flight_plan.flight_rules)
    }
}

function getEnrouteTime(enroute: string | undefined): number {
    if (!enroute) return 0

    const enrouteHours = parseInt(enroute.slice(0, 2), 10)
    const enrouteMinutes = parseInt(enroute.slice(2), 10)
    return (enrouteHours * 60 + enrouteMinutes) * 60 * 1000
}

function getFlightRule(rule: string | undefined): string {
    switch (rule) {
        case 'V':
            return 'VFR'
        case 'I':
            return 'IFR'
        default:
            return 'N/A'
    }
}

function getAircraftData(pilot: VatsimPilot | VatsimPrefile): GeneralAircraft | null {
    if (!pilot.flight_plan) return null

    const typecode = pilot.flight_plan.aircraft_short
    const operatorIcao = pilot.callsign.slice(0, 3)
    const filteredFleet = fleets.filter(aircraft => aircraft.typecode === typecode && aircraft.operatorIcao === operatorIcao)

    if (filteredFleet.length <= 0) {
        const anyType = fleets.filter(aircraft => aircraft.typecode === typecode)
        const anyOperator = fleets.filter(aircraft => aircraft.operatorIcao === operatorIcao)

        return {
            icao: typecode ?? 'Unknown',
            type: anyType[0]?.model ?? 'Unknown',
            country: anyOperator[0]?.country ?? 'Unknown'
        }
    }

    const randomAircraft = filteredFleet[Math.floor(Math.random() * filteredFleet.length)]

    return {
        icao: randomAircraft.typecode ?? 'Unknwon',
        type: randomAircraft.model ?? 'Unknown',
        registration: randomAircraft.registration ?? 'Unknown',
        country: randomAircraft.country ?? 'Unknown',
        msn: randomAircraft.serialNumber ?? 'Unknown',
        age: randomAircraft.built ? calculateAge(new Date(randomAircraft.built)) : Math.floor(Math.random() * (25 - 5 + 1)) + 5
    }
}

function calculateAge(date: Date): number {
    const today = new Date()
    let age = today.getFullYear() - date.getFullYear()
    const monthDifference = today.getMonth() - date.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) {
        age--
    }

    return age
}

function getAirlineData(pilot: VatsimPilot | VatsimPrefile): GeneralAirline {
    const icao = pilot.callsign.substring(0, 3)
    const airline = airlines.find(airline => airline.icao === icao)

    const colors = getAirlineColor(icao)

    return {
        icao: icao,
        iata: airline?.iata || icao,
        name: airline?.name || 'Unknown',
        flightno: airline?.iata ? airline.iata + pilot.callsign.substring(3) : pilot.callsign,
        ...(colors ? { bg: colors.bg, font: colors.font } : {})
    }
}

function getAirlineColor(icao: string): { bg: string, font: string } | null {
    const colors = airlineColors[icao]
    if (!colors) return null

    return {
        bg: colors.bg,
        font: colors.font
    }
}

function generateHash(general: GeneralData) {
    const depIcao = general.airport?.dep.properties?.icao
    const arrIcao = general.airport?.arr.properties?.icao
    const cid = general.index.cid
    if (!depIcao || !arrIcao) return

    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    const raw = `${year}-${month}-${day}_${depIcao}_${arrIcao}_${cid}`

    general.index.hash = createHash('sha256').update(raw).digest('hex').substring(0, 8)
}