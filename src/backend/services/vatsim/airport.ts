import { vatsimDataStorage } from "@/storage/backend/vatsim";
import { VatsimStorageAirportData, VatsimStorageGeneralData, VatsimStorageStatusData } from "@/types/vatsim";

export function updateAirport() {
    if (!vatsimDataStorage.generals || !vatsimDataStorage.statuss) return

    const newAirports: { [key: string]: VatsimStorageAirportData } = {}

    for (const general of vatsimDataStorage.generals) {
        const status = vatsimDataStorage.statuss.find(status => status.index.callsign === general.index.callsign) ?? null
        setAirportData(newAirports, general, status)
    }
    setBusiestsAndRouteData(newAirports)

    vatsimDataStorage.airports = Object.values(newAirports)
}

function setAirportData(newAirports: { [key: string]: VatsimStorageAirportData }, general: VatsimStorageGeneralData, status: VatsimStorageStatusData | null) {
    const depIcao = general.airport?.dep.properties?.icao
    const arrIcao = general.airport?.arr.properties?.icao

    if (!newAirports[depIcao]) {
        newAirports[depIcao] = initAirport(depIcao)
    }

    if (!newAirports[arrIcao]) {
        newAirports[arrIcao] = initAirport(arrIcao)
    }

    const [depDelay, arrDelay] = getFlightDelay(status)

    newAirports[depIcao].departures.n += 1
    if (depDelay > 30) {
        newAirports[depIcao].departures.nDelay += 1
        newAirports[depIcao].departures.tDelay += depDelay
    }

    newAirports[arrIcao].arrivals.n += 1
    if (arrDelay > 30) {
        newAirports[arrIcao].arrivals.nDelay += 1
        newAirports[arrIcao].arrivals.tDelay += arrDelay
    }

    const route = `${depIcao}-${arrIcao}`
    if (newAirports[depIcao].routes!.has(route)) {
        newAirports[depIcao].routes!.set(route, newAirports[depIcao].routes!.get(route)! + 1)
    } else {
        newAirports[depIcao].routes!.set(route, 1)
    }

    if (newAirports[arrIcao].routes!.has(route)) {
        newAirports[arrIcao].routes!.set(route, newAirports[arrIcao].routes!.get(route)! + 1)
    } else {
        newAirports[arrIcao].routes!.set(route, 1)
    }
}

function getFlightDelay(status: VatsimStorageStatusData | null): number[] {
    if (!status) return [0, 0]

    const depDelay = Math.round((status.times.actDep.getTime() - status.times.schedDep.getTime()) / 1000 / 60)
    const arrDelay = Math.round((status.times.actArr.getTime() - status.times.schedArr.getTime()) / 1000 / 60)

    return [limitDelay(depDelay), limitDelay(arrDelay)]
}

function limitDelay(delay: number) {
    if (delay < 0 || delay > 120) return 0
    return delay
}

function initAirport(icao: string): VatsimStorageAirportData {
    return {
        icao: icao,
        departures: {
            n: 0,
            tDelay: 0,
            nDelay: 0
        },
        arrivals: {
            n: 0,
            tDelay: 0,
            nDelay: 0
        },
        busiest: '',
        connections: 0,
        routes: new Map()
    }
}

function setBusiestsAndRouteData(newAirports: { [key: string]: VatsimStorageAirportData }) {
    Object.values(newAirports).forEach(airport => {
        let busiestRoute = null
        let maxFlights = 0

        airport.routes!.forEach((count, route) => {
            if (count > maxFlights) {
                maxFlights = count
                busiestRoute = route
            }
        })

        airport.busiest = busiestRoute ?? '-'
        airport.connections = airport.routes?.size ?? 0
        delete airport.routes

        airport.departures.tDelay = Math.round(airport.departures.tDelay / airport.departures.n)
        airport.arrivals.tDelay = Math.round(airport.arrivals.tDelay / airport.arrivals.n)
    })
}