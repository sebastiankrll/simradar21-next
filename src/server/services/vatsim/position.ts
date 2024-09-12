import { rawDataStorage, vatsimDataStorage } from "@/server/storage";
import { GeneralData, PositionData, VatsimPilot, VatsimTransceiver } from "@/types/data/vatsim";
import airlinesJSON from '@/assets/data/airlines.json'
const airlines = airlinesJSON as Airlines[]
import aircraftsJSON from '@/assets/data/aircrafts.json'
import { Aircrafts, Airlines } from "@/types/data/misc";
import { calculateDistance, toDegrees, toRadians } from "@/assets/utils/common";
const aircrafts = aircraftsJSON as Aircrafts

export function updatePosition() {
    if (!rawDataStorage.vatsim?.pilots) return

    const newPositions = []
    const disconnected = vatsimDataStorage.position?.filter(position => !rawDataStorage.vatsim?.pilots.some(pilot => position.callsign === pilot.callsign))

    if (disconnected) {
        for (const position of disconnected) {
            const normalDisconnect = checkDisconnectType(position)
            if (normalDisconnect) continue

            const generalData = vatsimDataStorage.general?.find(general => general.index.callsign === position.callsign) ?? null
            const newPosition = estimatePosition(structuredClone(position), structuredClone(generalData))
            if (newPosition) newPositions.push(newPosition)
        }
    }

    for (const pilot of rawDataStorage.vatsim?.pilots) {
        const transceivers = rawDataStorage.transveivers?.find(tx => tx.callsign === pilot.callsign)
        const transceiver = transceivers ? transceivers.transceivers[0] : null

        const prevPosition = structuredClone(vatsimDataStorage.position?.find(pos => pos.callsign === pilot.callsign) ?? null)
        const dT = vatsimDataStorage.timestamp ? Date.now() - vatsimDataStorage.timestamp?.getTime() : 0

        newPositions.push(getPositionData(prevPosition, pilot, transceiver, dT))
    }

    vatsimDataStorage.position = newPositions
    vatsimDataStorage.timestamp = new Date()
}

function getPositionData(prevPosition: PositionData | null, pilot: VatsimPilot, transceiver: VatsimTransceiver | null, dT: number): PositionData {

    const kpm = prevPosition?.groundspeeds ? (pilot.groundspeed - prevPosition.groundspeeds[0]) / (dT / 1000) * 60 : 0
    const fpm = prevPosition?.altitudes ? (pilot.altitude - prevPosition?.altitudes[0]) / (dT / 1000) * 60 : 0

    const radarHeight = transceiver ? Math.round(transceiver.heightAglM * 3.28084) : pilot.altitude
    const frequency = transceiver ? (transceiver?.frequency / 1000000).toFixed(3) : '122.800'
    const airline = airlines.find(airline => airline.icao === pilot.callsign.substring(0, 3))

    return {
        callsign: pilot.callsign,
        aircraft: pilot.flight_plan?.aircraft_short ?? null,
        coordinates: [pilot.longitude, pilot.latitude],
        altitudes: [pilot.altitude, fpm ? Math.round(fpm / 100) * 100 : 0, radarHeight],
        groundspeeds: [pilot.groundspeed, kpm ? Math.round(kpm / 100) * 100 : 0],
        heading: pilot.heading,
        frequency: frequency,
        airports: pilot.flight_plan?.departure && pilot.flight_plan.arrival ? [pilot.flight_plan?.departure, pilot.flight_plan?.arrival] : null,
        airline: airline?.iata ?? null,
        type: getAircraftType(pilot),
        connected: true
    }
}

function getAircraftType(pilot: VatsimPilot): number {
    const ac = pilot.flight_plan?.aircraft_short

    if (!ac) return 1

    const type = aircrafts[ac] ?? -1
    const rmks = pilot.flight_plan?.remarks

    if (rmks?.toLowerCase().includes('cargo')) return 1
    return type
}

function checkDisconnectType(position: PositionData): boolean {
    if (position.altitudes[2] < 200 && position.groundspeeds[0] < 30) return true
    return false
}

function estimatePosition(prevPosition: PositionData, general: GeneralData | null): PositionData | null {
    if (!general?.airport || !general.flightplan) return null

    const destination = general.airport.arr.geometry.coordinates
    const remainingDistance = calculateDistance(prevPosition.coordinates, destination)
    if (remainingDistance < 5) return null

    const bearing = calculateBearing(prevPosition.coordinates, destination)
    const dT = vatsimDataStorage.timestamp ? Date.now() - vatsimDataStorage.timestamp?.getTime() : 0
    const filedSpeed = general.flightplan?.filedSpeed

    const newCoordinates = getNextPosition(prevPosition.coordinates, bearing, filedSpeed, dT)

    const filedLevel = general.flightplan.filedLevel
    const deltaAlt = prevPosition.altitudes[0] >= filedLevel ? 0 : Math.min(1000 / 60 * dT / 1000, filedLevel - prevPosition.altitudes[0])
    const newAltitudes = [prevPosition.altitudes[0] + deltaAlt, deltaAlt, prevPosition.altitudes[0] + deltaAlt]

    const newSpeeds = [filedSpeed, 0]

    return {
        ...prevPosition,
        coordinates: newCoordinates,
        heading: bearing,
        altitudes: newAltitudes,
        groundspeeds: newSpeeds,
        frequency: '122.800',
        connected: false
    }
}

function calculateBearing(currentPosition: number[], destination: number[]): number {
    const lat1Rad = toRadians(currentPosition[1])
    const lat2Rad = toRadians(destination[1])
    const dLonRad = toRadians(destination[0] - currentPosition[0])

    const y = Math.sin(dLonRad) * Math.cos(lat2Rad)
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLonRad)

    return (toDegrees(Math.atan2(y, x)) + 360) % 360
}

function getNextPosition(currentPosition: number[], bearing: number, speed: number, dT: number): number[] {
    const latRad = toRadians(currentPosition[1])
    const lonRad = toRadians(currentPosition[0])
    const headingRad = toRadians(bearing)

    const angularDistance = speed * dT / 3600 / 1000 / 3440.065

    const newLatRad = Math.asin(
        Math.sin(latRad) * Math.cos(angularDistance) +
        Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(headingRad)
    )

    const newLonRad = lonRad + Math.atan2(
        Math.sin(headingRad) * Math.sin(angularDistance) * Math.cos(latRad),
        Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLatRad)
    )

    return [toDegrees(newLonRad), toDegrees(newLatRad)]
}