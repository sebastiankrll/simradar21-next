export function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
}

export function toDegrees(radians: number): number {
    return radians * (180 / Math.PI)
}

export function calculateDistance(start: number[], end: number[]): number {
    const R = 3440.065
    const lat1Rad = toRadians(start[1])
    const lat2Rad = toRadians(end[1])
    const dLat = lat2Rad - lat1Rad
    const dLon = toRadians(end[0] - start[0])

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return Math.round(R * c)
}

export function roundXMin(date: Date, x: number): Date {
    const newDate = new Date(date.getTime())
    const minutes = newDate.getMinutes()

    const remainder = minutes % x

    if (remainder !== 0) {
        newDate.setMinutes(minutes + (x - remainder))
    }

    newDate.setSeconds(0)
    newDate.setMilliseconds(0)

    return newDate
}

export function roundNumToX(number: number, x: number) {
    return Math.round(number / x) * x
}

export function convertVatsimDate(str: string): Date {
    const hours = parseInt(str.slice(0, 2))
    const minutes = parseInt(str.slice(2))
    const now = new Date()

    now.setUTCHours(hours)
    now.setUTCMinutes(minutes)
    now.setUTCSeconds(0)
    now.setUTCMilliseconds(0)

    return now
}

export function getUtcString(time: Date | string) {
    if (!time) {
        return 'xx:xx'
    }
    time = new Date(time)

    const hours = String(time.getUTCHours()).padStart(2, '0')
    const minutes = String(time.getUTCMinutes()).padStart(2, '0')

    return `${hours}:${minutes}`
}

export function convertLengthUnit(nm: number): string {
    return Math.round(nm * 1.852).toLocaleString()
}

export function getDurationString(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    const formattedHours = String(hours).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}`
}