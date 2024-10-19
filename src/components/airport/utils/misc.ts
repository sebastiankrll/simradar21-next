import { AirportAPIData } from "@/types/vatsim"

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