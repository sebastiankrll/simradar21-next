import { VatsimParsedMetar } from "@/types/vatsim"
import axios from "axios"
import { IMetar, IWeatherCondition, parseMetar } from "metar-taf-parser"

export async function updateAirport() {
    await updateMetar()
}

export async function updateMetar() {
    const metars = await getMetar()
    if (!metars) return

    console.log(Object.keys(metars).length)

    // const weathers = Object.keys(metars).map(icao => {
    //     const metar = metars[icao]
    //     if (!metar) return null

    //     return {
    //         icao: icao,
    //         weather: {
    //             cond: getMetarCond(metar),
    //             temp: metar?.temperature?.celsius,
    //             dewPoint: metar?.dewpoint?.celsius,
    //             wind: [metar?.wind?.degrees, metar?.wind?.speed_kts],
    //             altimeters: Math.round(metar?.barometer?.mb),
    //             humidity: Math.round(metar?.humidity_percent),
    //             raw: metar?.raw_text
    //         }
    //     }
    // })
}

// async updateTz() {
//     if (process.env.NODE_ENV !== 'production') {
//         return
//     }
//     const tzs = await this.getTimezones()
//     const keys = Object.keys(airports_tz)

//     const times = keys.map(key => {
//         const tz = tzs[airports_tz[key]]

//         return {
//             icao: key,
//             time: {
//                 abbreviation: tz?.abbreviation,
//                 utc_offset: tz?.utc_offset,
//             }
//         }
//     })

//     const bulkOps = times.map(update => ({
//         updateOne: {
//             filter: { icao: update.icao },
//             update: { time: update.time }
//         }
//     }))

//     try {
//         await this.Airport.bulkWrite(bulkOps)
//         console.log('Updated airports timezone data.')
//     } catch (error) {
//         console.error('Error saving airports data to MongoDB:', error)
//         throw error
//     }
// }

// async getTimezones() {
//     const timezoneResponse = await axios.get('http://worldtimeapi.org/api/timezone')
//     const timezones = timezoneResponse.data

//     const timeFetchPromises = timezones.map(async (timezone) => {
//         try {
//             const timeResponse = await axios.get(`http://worldtimeapi.org/api/timezone/${timezone}`)
//             return { timezone, time: timeResponse.data }
//         } catch (error) {
//             return { timezone, time: null }
//         }
//     })

//     const temp = {}
//     const times = await Promise.all(timeFetchPromises)

//     times.forEach(({ timezone, time }) => {
//         if (time) {
//             temp[timezone] = time
//         }
//     })

//     return temp
// }

async function getMetar(): Promise<VatsimParsedMetar | null> {
    try {
        const response = await axios.get('https://metar.vatsim.net/all')
        if (response.status !== 200) {
            throw new Error('Network response was not ok ' + response.statusText)
        }

        const metarData = response.data as string
        return parseMetarData(metarData)
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error)
    }

    return null
}

function parseMetarData(data: string): VatsimParsedMetar {
    const metarLines = data.split('\n')
    const temp: VatsimParsedMetar = {}

    metarLines.forEach(line => {
        const icaoCode = line.substring(0, 4)
        if (icaoCode) {
            try {
                temp[icaoCode] = parseMetar(line)
            } catch (error) {
                temp[icaoCode] = null
            }
        }
    })
    return temp
}

// function getMetarCond(metar: IMetar): string {
//     if (!metar) return 'Unknown'

//     const condition = getCondition(metar.weatherConditions)
//     if (condition) return condition

//     if (!metar.clouds) return 'Clear'

//     const clouds = metar.clouds.map(cloud => cloud.quantity)

//     if (clouds.includes('OVC')) {
//         return 'Overcast'
//     }
//     if (clouds.includes('SCT') || clouds.includes('BKN')) {
//         return 'Cloudy'
//     }
//     if (clouds.includes('FEW')) {
//         return 'Clear'
//     }

//     return 'Unknown'
// }

function getCondition(conditions: IWeatherCondition[]): string | null {
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
            if (idx && (!mostSevere?.index || idx < mostSevere.index)) mostSevere = {
                index: idx,
                code: severityOrder[idx].code,
                description: severityOrder[idx].description,
                intensity: condition.intensity ?? ''
            }
        }

        for (const phenomenon of condition.phenomenons) {
            const idx = severityOrder.findIndex(severity => severity.code === phenomenon)
            if (idx && (!mostSevere?.index || idx < mostSevere.index)) mostSevere = {
                index: idx,
                code: severityOrder[idx].code,
                description: severityOrder[idx].description,
                intensity: condition.intensity ?? ''
            }
        }
    }

    if (mostSevere) return getIntensity(mostSevere.intensity, mostSevere.description) + mostSevere.description
    return null
}

function getIntensity(intensity: string, cond: string): string {
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