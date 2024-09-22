import { getVatsimStorage, setVatsimStorage } from "@/storage/singletons/vatsim"
import { PositionData, TrackData, TrackPoint } from "@/types/vatsim"

export function updateTrack() {
    updateTrackData()
}

export function updateTrackData() {
    const vatsimDataStorage = getVatsimStorage()
    if (!vatsimDataStorage.position) return

    const newTracks = []

    for (const position of vatsimDataStorage.position) {
        const prevTrack = structuredClone(vatsimDataStorage.track?.find(track => track.callsign === position.callsign))
        const newPoint = getTrackPoint(position, vatsimDataStorage.timestamp)

        if (!prevTrack) {
            const newTrack: TrackData = {
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

    vatsimDataStorage.track = newTracks
    setVatsimStorage(vatsimDataStorage)
}

function checkSamePosition(lastPoint: TrackPoint | null, newPoint: TrackPoint): boolean {
    if (!lastPoint) return true
    return !(lastPoint.coordinates[0] === newPoint.coordinates[0] && lastPoint.coordinates[1] === newPoint.coordinates[1])
}

function getTrackPoint(position: PositionData, timestamp: Date | null): TrackPoint {

    return {
        coordinates: position.coordinates,
        altitudes: [position.altitudes[0], position.altitudes[2]],
        groundspeed: position.groundspeeds[0],
        connected: position.connected,
        timestamp: timestamp ? timestamp : new Date()
    }
}