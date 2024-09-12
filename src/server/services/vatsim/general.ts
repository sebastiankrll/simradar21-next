import { rawDataStorage, vatsimDataStorage } from "@/server/storage/vatsim"
import { GeneralAircraft, GeneralAirline, GeneralAirport, GeneralData, GeneralFlightPlan, GeneralIndex, VatsimPilot, VatsimPrefile } from "@/types/data/vatsim"
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson"
import airportsJSON from '@/assets/data/airports_full.json'
const airports = airportsJSON as FeatureCollection
import fleetsJSON from '@/assets/data/fleets.json'
import { Airlines, Fleet } from "@/types/data/misc"
const fleets = fleetsJSON as Fleet[]
import airlinesJSON from '@/assets/data/airlines.json'
import { convertVatsimDate } from "@/assets/utils/common"
const airlines = airlinesJSON as Airlines[]

export function updateGeneral() {
    updateGeneralData()
    updateGeneralDataPrefile()
}

export function updateGeneralData() {
    if (!rawDataStorage.vatsim?.pilots || !vatsimDataStorage.position) return

    const newGenerals = []

    for (const position of vatsimDataStorage.position) {
        const prevGeneral = structuredClone(vatsimDataStorage.general?.find(general => general.index.callsign === position.callsign) ?? null)
        if (!position.connected && prevGeneral) {
            newGenerals.push(prevGeneral)
            continue
        }

        const pilot = structuredClone(rawDataStorage.vatsim.pilots.find(pilot => pilot.callsign === position.callsign))
        if (!pilot) continue

        const noDataChange = prevGeneral ? checkSameData(pilot, prevGeneral) : false
        const newGeneral: GeneralData = {
            index: prevGeneral?.index && noDataChange ? prevGeneral?.index : getIndexData(pilot),
            airport: getAirportData(pilot),
            flightplan: getFlightPlanData(pilot),
            aircraft: prevGeneral?.aircraft && noDataChange ? prevGeneral?.aircraft : getAircraftData(pilot),
            airline: prevGeneral?.airline && noDataChange ? prevGeneral?.airline : getAirlineData(pilot)
        }

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

        newGenerals.push(newGeneral)
    }

    vatsimDataStorage.generalPre = newGenerals
}

function checkSameData(pilot: VatsimPilot, prevGeneral: GeneralData): boolean {
    const airportsChange = pilot.flight_plan?.departure === prevGeneral.airport?.dep.properties?.icao && pilot.flight_plan?.arrival === prevGeneral.airport?.arr.properties?.icao
    const flightplanChange = pilot.flight_plan?.route === prevGeneral.flightplan?.plan

    return airportsChange && flightplanChange
}

function getIndexData(pilot: VatsimPilot | VatsimPrefile): GeneralIndex {
    if ('pilot_rating' in pilot) {
        return {
            cid: pilot.cid,
            callsign: pilot.callsign,
            name: pilot.name,
            rating: getRating(pilot.pilot_rating),
            server: pilot.server,
        }
    } else {
        return {
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
        enrouteTime: pilot.flight_plan.enroute_time ? parseInt(pilot.flight_plan.enroute_time) : 0,
        plan: pilot.flight_plan.route ?? '',
        remarks: pilot.flight_plan.remarks ?? '',
        rules: getFlightRule(pilot.flight_plan.flight_rules)
    }
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

    return {
        icao: icao,
        iata: airline?.iata ?? icao,
        name: airline?.name ?? 'Unknown',
        flightno: airline?.iata ? airline.iata + pilot.callsign.substring(3) : pilot.callsign
    }
}

