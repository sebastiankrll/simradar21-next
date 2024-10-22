import { AirportTimezone, AirportWeather } from "@/types/vatsim"
import axios from "axios"
import { CloudQuantity, IMetar, IWeatherCondition, parseMetar } from "metar-taf-parser"
import airportTimezonesJSON from '@/assets/data/airports_tz.json'
import { WorldTimeData } from "@/types/misc"
import { AirportFlight, FlightsSearchParam } from "@/types/panel"
import globalThis from "@/storage/singleton/next/global"

interface CachedMetar {
    raw: string,
    t: Date
}

interface CachedWorldTime {
    time: WorldTimeData,
    t: Date
}

const metarCache: { [key: string]: CachedMetar | undefined } = {}

export async function getAirportWeather(icao: string): Promise<AirportWeather | null> {
    const cachedMetar = metarCache[icao]
    if (!cachedMetar || Date.now() - cachedMetar.t.getTime() > 1000 * 60 * 15) await updateMetarCache(icao)

    return extractMetar(icao)
}

function extractMetar(icao: string): AirportWeather | null {
    const metar = metarCache[icao]?.raw
    if (!metar) return null

    const parsedMetar = parseMetar(metar)

    return {
        condition: parseMetarCondition(parsedMetar),
        temperature: parsedMetar.temperature ? parsedMetar.temperature + '°C' : 'N/A',
        dewPoint: parsedMetar.dewPoint ? parsedMetar.dewPoint + '°C' : 'N/A',
        wind: parsedMetar.wind ? (parsedMetar.wind.degrees ? parsedMetar.wind.degrees + '° ' : 'V ') + parsedMetar.wind.speed + 'kts' : 'N/A',
        altimeters: parsedMetar.altimeter ? parsedMetar.altimeter.value + parsedMetar.altimeter.unit : 'N/A',
        raw: metar
    }
}

async function updateMetarCache(icao: string) {
    const metar = await fetchMetar(icao)
    if (!metar) return

    metarCache[icao] = {
        raw: metar,
        t: new Date()
    }
}

async function fetchMetar(icao: string): Promise<string | null> {
    try {
        const response = await axios.get(`https://metar.vatsim.net/${icao}`)
        if (response.status !== 200) {
            throw new Error('Network response was not ok ' + response.statusText)
        }

        return response.data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error)
    }

    return null
}

function parseMetarCondition(metar: IMetar): string {
    if (!metar) return 'Unknown'

    const condition = getMetarCondition(metar.weatherConditions)
    if (condition) return condition

    const clouds = metar.clouds.map(cloud => cloud.quantity)
    if (clouds.length < 1) return 'Clear'

    if (clouds.includes(CloudQuantity.OVC)) return 'Overcast'
    if (clouds.includes(CloudQuantity.SCT) || clouds.includes(CloudQuantity.BKN)) return 'Cloudy'

    return 'Clear'
}

function getMetarCondition(conditions: IWeatherCondition[]): string | null {
    const severityOrder = [
        { code: 'TS', description: 'Thunderstorm' },
        { code: 'SN', description: 'Snow' },
        { code: 'SG', description: 'Snow' },
        { code: 'GR', description: 'Hail' },
        { code: 'GS', description: 'Hail' },
        { code: 'RA', description: 'Rain' },
        { code: 'DZ', description: 'Drizzle' },
        { code: 'FG', description: 'Fog' },
        { code: 'BR', description: 'Mist' },
        { code: 'FU', description: 'Smoke' },
        { code: 'VA', description: 'Volcanic Ash' },
        { code: 'SA', description: 'Sand' },
        { code: 'HZ', description: 'Haze' },
        { code: 'SS', description: 'Sandstorm' },
        { code: 'DS', description: 'Duststorm' },
    ]

    let mostSevere: {
        index: number,
        code: string,
        description: string,
        intensity: string
    } | null = null

    for (const condition of conditions) {
        const descriptive = condition.descriptive

        if (descriptive) {
            const idx = severityOrder.findIndex(severity => severity.code === descriptive)
            if (idx !== -1 && (!mostSevere?.index || idx < mostSevere.index)) mostSevere = {
                index: idx,
                code: severityOrder[idx].code,
                description: severityOrder[idx].description,
                intensity: condition.intensity ?? ''
            }
        }

        for (const phenomenon of condition.phenomenons) {
            const idx = severityOrder.findIndex(severity => severity.code === phenomenon)
            if (idx !== -1 && (!mostSevere?.index || idx < mostSevere.index)) mostSevere = {
                index: idx,
                code: severityOrder[idx].code,
                description: severityOrder[idx].description,
                intensity: condition.intensity ?? ''
            }
        }
    }

    if (mostSevere) return getMetarIntensity(mostSevere.intensity, mostSevere.description) + mostSevere.description
    return null
}

function getMetarIntensity(intensity: string, cond: string): string {
    const excl = ['Thunderstorm', 'Smoke', 'Volcanic Ash', 'Sand', 'Sandstorm', 'Duststorm']
    if (excl.includes(cond)) return ''

    switch (intensity) {
        case '+':
            return 'Heavy '
        case '-':
            return 'Light '
        default:
            return ''
    }
}


const airportTimezones = airportTimezonesJSON as { [key: string]: string | undefined }
const worldtimeCache: { [key: string]: CachedWorldTime | undefined } = {}

export async function getAirportTimezone(icao: string): Promise<AirportTimezone | null> {
    const cachedWorldtime = getCachedWorldtime(icao)
    if (!cachedWorldtime || Date.now() - cachedWorldtime.t.getTime() > 1000 * 60 * 60 * 24) await updateWorldtimeCache(icao)

    return getWorldtime(icao)
}

function getWorldtime(icao: string): AirportTimezone | null {
    const timezone = airportTimezones[icao]
    if (!timezone) return null

    const worldtime = worldtimeCache[timezone]
    if (!worldtime) return null

    return {
        abbreviation: worldtime.time.abbreviation,
        utc_offset: worldtime.time.utc_offset
    }
}

function getCachedWorldtime(icao: string): CachedWorldTime | undefined {
    const timezone = airportTimezones[icao]
    if (!timezone) return

    return worldtimeCache[timezone]
}

async function updateWorldtimeCache(icao: string) {
    const timezone = airportTimezones[icao]
    if (!timezone) return

    const worldtime = await fetchWorldtime(timezone)
    if (!worldtime) return

    worldtimeCache[timezone] = {
        time: worldtime,
        t: new Date()
    }
}

async function fetchWorldtime(timezone: string): Promise<WorldTimeData | null> {
    try {
        const response = await axios.get(`http://worldtimeapi.org/api/timezone/${timezone}`)
        if (response.status !== 200) {
            throw new Error('Network response was not ok ' + response.statusText)
        }

        return response.data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error)
    }

    return null
}

export async function getAirportFlights(params: FlightsSearchParam): Promise<AirportFlight[] | undefined> {
    try {
        const flights = await fetchAirportFlights(params)
        const reversed = params.pagination === 'next' ? flights : flights?.reverse()

        return reversed?.map(flight => {
            return {
                general: flight.general,
                status: flight.status
            }
        })
    } catch (error) {
        console.error(`Error fetching flights data for airport ${params.icao} / ${params.direction} from MongoDB:`, error)
        throw error
    }
}

async function fetchAirportFlights(params: FlightsSearchParam) {
    if (params.direction === 'departure') {
        return await globalThis.FlightModel.find({
            'general.airport.dep.properties.icao': params.icao,
            'status.times.schedDep': params.pagination === 'next' ? { $gt: new Date(params.timestamp) } : { $lt: new Date(params.timestamp) }
        })
            .sort(params.pagination === 'next' ? { 'status.times.schedDep': 1 } : { 'status.times.schedDep': -1 })
            .limit(params.n)
    }
    if (params.direction === 'arrival') {
        return await globalThis.FlightModel.find({
            'general.airport.arr.properties.icao': params.icao,
            'status.times.schedArr': params.pagination === 'next' ? { $gt: new Date(params.timestamp) } : { $lt: new Date(params.timestamp) }
        })
            .sort(params.pagination === 'next' ? { 'status.times.schedArr': 1 } : { 'status.times.schedArr': -1 })
            .limit(params.n)
    }
}