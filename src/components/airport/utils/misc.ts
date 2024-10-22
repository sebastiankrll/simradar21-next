import { AirportFlight } from "@/types/panel"
import { AirportAPIData } from "@/types/vatsim"
import { getUtcString } from "@/utils/common"

export function getAirportTime(airport: AirportAPIData | null | undefined): string {
    const getFallback = (): string => {
        const now = new Date()
        const hh = now.getUTCHours().toString().padStart(2, '0')
        const mm = now.getUTCMinutes().toString().padStart(2, '0')

        return `${hh}:${mm} UTC`
    }

    if (!airport?.timezone) return getFallback()

    const time = airport.timezone
    const utcTime = Date.now()

    const offset = time.utc_offset
    const regex = /^([+-])(\d{2}):(\d{2})$/
    const matches = offset.match(regex)
    if (!matches || matches.length < 1) return getFallback()

    const sign = matches[1] === '+' ? 1 : -1
    const hours = parseInt(matches[2], 10)
    const minutes = parseInt(matches[3], 10)

    const milliseconds = sign * ((hours * 60 * 60 * 1000) + (minutes * 60 * 1000))
    const localTime = new Date(utcTime + milliseconds)

    const hh = localTime.getUTCHours().toString().padStart(2, '0')
    const mm = localTime.getUTCMinutes().toString().padStart(2, '0')

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' }
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(localTime)

    return `${hh}:${mm} ${time.abbreviation} (UTC ${time.utc_offset}) | ${formattedDate}`
}

export function checkIfNewDay(date1: Date, date2: Date) {
    const year1 = date1.getUTCFullYear()
    const month1 = date1.getUTCMonth()
    const day1 = date1.getUTCDate()

    const year2 = date2.getUTCFullYear()
    const month2 = date2.getUTCMonth()
    const day2 = date2.getUTCDate()

    return year1 !== year2 || month1 !== month2 || day1 !== day2
}

export function getFlightDelayColor(data: AirportFlight, direction: string): string {
    const times = data.status.times
    if (!times || data.status.progress.status === 'prefile') return 'rgb(183, 190, 206)'

    const delay = direction === 'departure' ?
        Math.max((new Date(times.actDep).getTime() - new Date(times.schedDep).getTime()) / 1000 / 60, 0) :
        Math.max((new Date(times.actArr).getTime() - new Date(times.schedArr).getTime()) / 1000 / 60, 0)

    if (delay <= 15) return 'rgb(11, 211, 167)'
    if (delay > 15 && delay <= 30) return 'rgb(255, 244, 43)'

    return 'rgb(234, 89, 121)'
}

export function getFlightTimesArray(data: AirportFlight, direction: string): string[] {
    if (!data.status.times) return ['xx:xx', 'N/A']

    const now = new Date()

    if (direction === 'departure') {
        if (data.status.progress.status === 'prefile') return ['SCHED', 'SCHED']

        if (new Date(data.status.times.actDep) <= now) {
            return [getUtcString(data.status.times.actDep), 'DEP']
        } else {
            return [getUtcString(data.status.times.actDep), 'EST']
        }
    }

    if (direction === 'arrival') {
        if (data.status.progress.status === 'prefile') return ['SCHED', 'SCHED']

        if (new Date(data.status.times.actArr) <= now) {
            return [getUtcString(data.status.times.actArr), 'LND']
        } else {
            return [getUtcString(data.status.times.actArr), 'EST']
        }
    }

    return ['xx:xx', 'N/A']
}