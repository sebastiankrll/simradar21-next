import { vatsimDataStorage } from "@/storage/backend/vatsim"
import { VatsimStoragePositionData, VatsimStorageTrackData, VatsimStorageTrackPoint } from "@/types/vatsim"

export function updateTrack() {
    updateTrackData()
}

export function updateTrackData() {
    if (!vatsimDataStorage.positions) return

    const newTracks = []

    for (const position of vatsimDataStorage.positions) {
        const prevTrack = structuredClone(vatsimDataStorage.tracks?.find(track => track.callsign === position.callsign))
        const newPoint = getTrackPoint(position, vatsimDataStorage.timestamp)

        if (!prevTrack) {
            const newTrack: VatsimStorageTrackData = {
                callsign: position.callsign,
                points: [newPoint]
            }
            newTracks.push(newTrack)
            continue
        }

        const lastPoint = prevTrack.points[prevTrack.points.length - 1]
        const moved = checkSamePosition(lastPoint, newPoint)

        if (!moved) {
            prevTrack.points[prevTrack.points.length - 1] = newPoint
            newTracks.push(prevTrack)
            continue
        }
        prevTrack.points.push(newPoint)
        newTracks.push(prevTrack)
    }

    vatsimDataStorage.tracks = newTracks
}

function checkSamePosition(lastPoint: VatsimStorageTrackPoint | null, newPoint: VatsimStorageTrackPoint): boolean {
    if (!lastPoint) return true
    return !(lastPoint.coordinates[0] === newPoint.coordinates[0] && lastPoint.coordinates[1] === newPoint.coordinates[1])
}

function getTrackPoint(position: VatsimStoragePositionData, timestamp: Date | null): VatsimStorageTrackPoint {

    return {
        coordinates: position.coordinates,
        altitudes: [position.altitudes[0], position.altitudes[2]],
        groundspeed: position.groundspeeds[0],
        connected: position.connected,
        timestamp: timestamp ? timestamp : new Date()
    }
}