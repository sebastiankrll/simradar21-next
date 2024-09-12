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
    const dLon = toRadians(end[0] - end[1])

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
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