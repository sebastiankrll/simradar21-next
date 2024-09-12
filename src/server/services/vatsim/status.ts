import { calculateDistance, roundXMin } from "@/assets/utils/common"
import { rawDataStorage, vatsimDataStorage } from "@/server/storage"
import { GeneralData, PositionData, StatusData, StatusIndex, StatusProgress, StatusTimes, VatsimPilot, VatsimPrefile } from "@/types/data/vatsim"

const taxiTime = 10 * 60000
let now = new Date()

export function updateStatus() {
    now = new Date()
    updateStatusData()
    updateStatusDataPrefile()
}

export function updateStatusData() {
    if (!rawDataStorage.vatsim?.pilots || !vatsimDataStorage.position || !vatsimDataStorage.general) return

    const newStatuses = []

    for (const position of vatsimDataStorage.position) {
        const prevStatus = structuredClone(vatsimDataStorage.status?.find(status => status.index.callsign === position.callsign) ?? null)
        const general = structuredClone(vatsimDataStorage.general.find(general => general.index.callsign === position.callsign) ?? null)
        const pilot = structuredClone(rawDataStorage.vatsim.pilots.find(pilot => pilot.callsign === position.callsign) ?? null)

        const newStatus = getStatusData(prevStatus, position, general, pilot)
        if (!newStatus) continue
        newStatuses.push(newStatus)
    }

    vatsimDataStorage.status = newStatuses
}

export function updateStatusDataPrefile() {
    if (!rawDataStorage.vatsim?.prefiles || !vatsimDataStorage.generalPre) return

    const newStatuses = []

    for (const prefile of rawDataStorage.vatsim.prefiles) {
        const general = structuredClone(vatsimDataStorage.generalPre.find(general => general.index.callsign === prefile.callsign) ?? null)

        const newStatus = getPrefileStatus(prefile, general)
        if (!newStatus) continue

        newStatuses.push(newStatus)
    }

    vatsimDataStorage.statusPre = newStatuses
}

function getPrefileStatus(prefile: VatsimPrefile, general: GeneralData | null): StatusData | undefined {
    if (!general?.flightplan?.depTime || !general.airport) return

    const depLoc = general.airport?.dep.geometry.coordinates as number[]
    const arrLoc = general.airport?.arr.geometry.coordinates as number[]

    const arrDist = calculateDistance(depLoc, arrLoc) * 1.1

    const index: StatusIndex = {
        callsign: prefile.callsign,
        altitude: 0
    }
    const times: StatusTimes = {
        offBlock: roundXMin(new Date(general.flightplan?.depTime.getTime() - taxiTime), 5),
        schedDep: roundXMin(general.flightplan?.depTime, 5),
        actDep: roundXMin(general.flightplan?.depTime, 5),
        schedArr: roundXMin(new Date(general.flightplan?.depTime.getTime() + general.flightplan.enrouteTime), 5),
        actArr: roundXMin(new Date(general.flightplan?.depTime.getTime() + general.flightplan.enrouteTime), 5),
        onBlock: roundXMin(new Date(general.flightplan?.depTime.getTime() + general.flightplan.enrouteTime + taxiTime), 5)
    }
    const progress: StatusProgress = {
        status: 'prefile',
        stops: 0,
        depDist: 0,
        arrDist: arrDist
    }

    return {
        index: index,
        times: times,
        progress: progress
    }
}

function getStatusData(prevStatus: StatusData | null, position: PositionData, general: GeneralData | null, pilot: VatsimPilot | null): StatusData | undefined {
    if (!general?.flightplan || !general.airport) return

    const currentPosition = position.coordinates
    const depLoc = general.airport?.dep.geometry.coordinates as number[]
    const arrLoc = general.airport?.arr.geometry.coordinates as number[]

    const depDist = calculateDistance(depLoc, currentPosition) * 1.1
    const arrDist = calculateDistance(currentPosition, arrLoc) * 1.1
    const totalDist = depDist + arrDist

    let index: StatusIndex
    let progress: StatusProgress
    let times: StatusTimes

    // Init StatusData
    if (prevStatus?.times && prevStatus.progress.status !== 'prefile') {
        index = structuredClone(prevStatus.index)
        progress = structuredClone(prevStatus.progress)
        times = structuredClone(prevStatus.times)
    } else {
        if (!pilot?.flight_plan || !general.flightplan?.depTime) return
        index = {
            callsign: pilot.callsign,
            transponder: pilot.transponder,
            altimeters: pilot.qnh_i_hg,
            altitude: pilot.altitude
        }
        times = {
            offBlock: roundXMin(new Date(general.flightplan?.depTime.getTime() - taxiTime), 5),
            schedDep: roundXMin(general.flightplan?.depTime, 5),
            actDep: roundXMin(general.flightplan?.depTime, 5),
            schedArr: roundXMin(new Date(general.flightplan?.depTime.getTime() + general.flightplan.enrouteTime), 5),
            actArr: roundXMin(new Date(general.flightplan?.depTime.getTime() + general.flightplan.enrouteTime), 5),
            onBlock: roundXMin(new Date(general.flightplan?.depTime.getTime() + general.flightplan.enrouteTime + taxiTime), 5)
        }
        progress = {
            status: 'In Flight',
            stops: 0,
            depDist: depDist,
            arrDist: arrDist
        }

        if (depDist > 3) {
            times.offBlock = new Date(now.getTime() - general.flightplan.enrouteTime * depDist / totalDist - taxiTime)
            times.actDep = new Date(now.getTime() - general.flightplan.enrouteTime * depDist / totalDist)
        } else {
            if (position.groundspeeds[0] > 0) {
                times.offBlock = now
                times.actDep = new Date(now.getTime() + taxiTime)
                progress.status = 'Taxi Out'
            } else {
                times.actDep = roundXMin(new Date(Math.max(times.schedDep.getTime(), now.getTime() + taxiTime)), 5)
                progress.status = 'Boarding'
            }
        }

        times.actArr = new Date(times.actDep.getTime() + general.flightplan.enrouteTime)

        return {
            index: index,
            times: times,
            progress: progress
        }
    }


    // Check if progressed from Boarding to Taxi Out status
    if (prevStatus.progress.status == 'Boarding') {
        if (position.groundspeeds[0] > 0) {
            times.offBlock = now
            times.actDep = new Date(now.getTime() + taxiTime)
            progress.status = 'Taxi Out'
        } else {
            times.actDep = roundXMin(new Date(Math.max(times.schedDep.getTime(), now.getTime() + taxiTime)), 5)
        }

        times.actArr = general.flightplan ? new Date(times.actDep.getTime() + general.flightplan.enrouteTime) : times.schedArr

        return {
            index: index,
            times: times,
            progress: progress
        }
    }


    // Check if progressed from Taxi Out to In Flight status
    if (prevStatus.progress.status == 'Taxi Out') {
        const deltaAlt = position.altitudes[0] - prevStatus.index.altitude

        if (deltaAlt > 200) {
            times.actDep = now
            progress.status = 'In Flight'
        } else {
            const deltaT = now.getTime() - times.offBlock.getTime()
            if (deltaT > taxiTime) {
                times.actDep = roundXMin(new Date(times.offBlock.getTime() + deltaT), 5)
            }
        }

        if (general.flightplan) times.actArr = new Date(times.actDep.getTime() + general.flightplan.enrouteTime)

        return {
            index: index,
            times: times,
            progress: progress
        }
    }


    // Check if progressed from In Flight to Taxi In status
    if (prevStatus.progress.status == 'In Flight') {
        const deltaAlt = position.altitudes[0] - prevStatus.index.altitude

        if (arrDist < 3 && position.groundspeeds[0] < 50 && deltaAlt < 200) {
            times.actArr = now
            progress.status = 'Taxi In'

            return {
                index: index,
                times: times,
                progress: progress
            }
        }

        times = inFlightETA(times, position, general)

        return {
            index: index,
            times: times,
            progress: progress
        }
    }


    // Check if progressed from Taxi In to On Block status (and stationary)
    if (prevStatus.progress.status == 'Taxi In') {
        if (position.groundspeeds[0] == 0) {
            progress.stops++
        } else {
            progress.stops = 0
        }

        const stationaryCheck = 5
        if (progress.stops > stationaryCheck) {
            times.onBlock = new Date(now.getTime() - stationaryCheck * 15 * 1000)
            progress.status = 'On Block'
        }

        return {
            index: index,
            times: times,
            progress: progress
        }
    }


    // Check if moving again after On Block status (stationary)
    if (prevStatus.progress.status == 'On Block' && position.groundspeeds[0] > 0) {
        if (!general.flightplan) return {
            index: index,
            times: times,
            progress: progress
        }

        progress.status = 'Taxi In'
        progress.stops = 0

        const delta = now.getTime() - times.actArr.getTime()
        if (delta + 2 * 60000 > taxiTime) {
            times.onBlock = new Date(times.actArr.getTime() + delta + 5 * 60000)
        }

        return {
            index: index,
            times: times,
            progress: progress
        }
    }

    return {
        index: index,
        times: times,
        progress: progress
    }

}

function inFlightETA(times: StatusTimes, position: PositionData, general: GeneralData): StatusTimes {
    const currentPosition = position.coordinates
    const depLoc = general.airport?.dep.geometry.coordinates as number[]
    const arrLoc = general.airport?.arr.geometry.coordinates as number[]

    const depDist = calculateDistance(depLoc, currentPosition) * 1.1
    const arrDist = calculateDistance(currentPosition, arrLoc) * 1.1
    const totalDist = depDist + arrDist

    // Inital delay
    const delayInitial = times.actDep?.getTime() - times.offBlock?.getTime() - taxiTime

    // Time needed to loose speed and altitude (to cover airport fly-overs)
    const arrElev = general.airport?.arr.properties ? general.airport?.arr.properties.elev : 0
    const timeEnergy = position.groundspeeds[0] / 5 * 1000 + (position.altitudes[0] - arrElev) / 1500 * 60000
    const distEnergy = position.groundspeeds[0] * timeEnergy / 1000 / 3600

    // Delay from delta between expected flight profile / distance from destination at t = x compared to actual position
    const filedLevel = general.flightplan?.filedLevel ? general.flightplan?.filedLevel : 30000
    const filedSpeed = general.flightplan?.filedSpeed ? general.flightplan?.filedSpeed : 250
    const climbTime = filedLevel / 2000 * 60000
    const climbDist = filedSpeed * climbTime / 2 / 1000 / 3600

    // If dist to airport < X on takeoff and landing freeze delay update.
    if (arrDist < 5 && arrDist < distEnergy) {
        return times
    }

    const keyPoints = [
        { x: 0, y: 150 },
        { x: climbDist === 0 ? 30 : climbDist, y: filedSpeed },
        { x: climbDist === 0 ? totalDist - 30 : totalDist - climbDist, y: filedSpeed },
        { x: totalDist, y: 150 }
    ]

    const remainingTime = times.schedArr.getTime() - now.getTime()
    const estRemainingAvgSpd = getAverageSpeed(keyPoints, 0, arrDist)
    const estRemainingTime = arrDist / estRemainingAvgSpd * 1000 * 3600

    const delayDeltaSched = estRemainingTime - remainingTime

    // Time needed at current speed and direct distance to destination (to account for current speed)
    const delayCurrentSpeed = arrDist / position.groundspeeds[0] * 1000 * 3600 - arrDist / estRemainingAvgSpd * 1000 * 3600

    let totDelay = delayInitial + delayDeltaSched + delayCurrentSpeed

    if (times.schedArr.getTime() + totDelay < now.getTime() + timeEnergy) {
        times.actArr = new Date(now.getTime() + timeEnergy)
    } else {
        times.actArr = new Date(times.schedArr.getTime() + totDelay)
    }

    return times
}

function getAverageSpeed(keyPoints: { x: number, y: number }[], start: number, end: number): number {
    function area(x: number): number {
        if (x <= keyPoints[1].x) {
            const slope = (keyPoints[1].y - keyPoints[0].y) / keyPoints[1].x
            return keyPoints[0].y * x + 0.5 * slope * x * x
        }
        if (x > keyPoints[1].x && x < keyPoints[2].x) {
            const areaAcc = keyPoints[0].y * keyPoints[1].x + 0.5 * (keyPoints[1].y - keyPoints[0].y) * keyPoints[1].x
            return areaAcc + keyPoints[1].y * (x - keyPoints[1].x)
        }
        if (x >= keyPoints[2].x) {
            const areaAcc = keyPoints[0].y * keyPoints[1].x + 0.5 * (keyPoints[1].y - keyPoints[0].y) * keyPoints[1].x
            const areaConst = keyPoints[1].y * (keyPoints[2].x - keyPoints[1].x)
            const decDist = x - keyPoints[2].x
            const slope = (keyPoints[1].y - keyPoints[0].y) / (keyPoints[3].x - keyPoints[2].x)
            return areaAcc + areaConst + (keyPoints[1].y * decDist - 0.5 * slope * decDist * decDist)
        }

        const slope = (keyPoints[1].y - keyPoints[0].y) / keyPoints[1].x
        return keyPoints[0].y * x + 0.5 * slope * x * x
    }

    const totalArea = area(end) - area(start)
    const totalDistance = end - start

    return totalArea / totalDistance
}