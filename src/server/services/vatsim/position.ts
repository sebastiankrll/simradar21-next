import { rawDataStorage, vatsimDataStorage } from "@/server/storage";
import { PositionData, VatsimPilot, VatsimTransceiver } from "@/types/data/vatsim";
import airlines from '@/assets/data/airlines.json'
import aircraftsJSON from '@/assets/data/aircrafts.json'
const aircrafts: Aircrafts = aircraftsJSON

export function setPositionsData() {
    if (!rawDataStorage.vatsim?.pilots) return

    const newPositions = []

    for (const pilot of rawDataStorage.vatsim?.pilots) {
        const transceivers = rawDataStorage.transveivers?.find(tx => tx.callsign === pilot.callsign)
        const transceiver = transceivers ? transceivers.transceivers[0] : null

        const prevPosition = vatsimDataStorage._position?.find(pos => pos.cs === pilot.callsign) ?? null
        const dT = vatsimDataStorage.timestamp ? Date.now() - vatsimDataStorage.timestamp?.getTime() : 0

        newPositions.push(getPositionData(prevPosition, pilot, transceiver, dT))
    }

    vatsimDataStorage._position = newPositions
}

function getPositionData(prevPosition: PositionData | null, pilot: VatsimPilot, transceiver: VatsimTransceiver | null, dT: number): PositionData {

    const kpm = prevPosition ? (pilot.groundspeed - prevPosition.gs[0]) / (dT / 1000) * 60 : 0
    const fpm = prevPosition ? (pilot.altitude - prevPosition?.alt[0]) / (dT / 1000) * 60 : 0

    const radarHeight = transceiver ? Math.round(transceiver.heightAglM * 3.28084) : pilot.altitude
    const frequency = transceiver ? (transceiver?.frequency / 1000000).toFixed(3) : '122.800'
    const airline = airlines.find(airline => airline.icao === pilot.callsign.substring(0, 3))

    return {
        cs: pilot.callsign,
        ac: pilot.flight_plan?.aircraft_short ?? null,
        co: [pilot.longitude, pilot.latitude],
        alt: [pilot.altitude, fpm ? Math.round(fpm / 100) * 100 : 0, radarHeight],
        gs: [pilot.groundspeed, kpm ? Math.round(kpm / 100) * 100 : 0],
        hdg: pilot.heading,
        frq: frequency,
        apt: pilot.flight_plan?.departure && pilot.flight_plan.arrival ? [pilot.flight_plan?.departure, pilot.flight_plan?.arrival] : null,
        iata: airline?.iata ?? null,
        typ: getAircraftType(pilot)
    }
}

function getAircraftType(pilot: VatsimPilot): number {
    const ac = pilot.flight_plan?.aircraft_short

    if (!ac) return 1

    const type = aircrafts[ac] ?? -1
    const rmks = pilot.flight_plan?.remarks

    if (rmks?.toLowerCase().includes('cargo')) {
        return 1
    } else {
        return type
    }
}