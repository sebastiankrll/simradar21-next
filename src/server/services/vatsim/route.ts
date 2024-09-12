import { vatsimDataStorage } from "@/server/storage/vatsim"
import { PositionData, RouteData, RoutePoint } from "@/types/data/vatsim"

export function updateRoute() {
    updateRouteData()
}

export function updateRouteData() {
    if (!vatsimDataStorage.position) return

    const newRoutes = []

    for (const position of vatsimDataStorage.position) {
        const prevRoute = structuredClone(vatsimDataStorage.route?.find(route => route.callsign === position.callsign))
        const newPoint = getRoutePoint(position)

        if (!prevRoute) {
            const newRoute: RouteData = {
                callsign: position.callsign,
                points: [newPoint]
            }
            newRoutes.push(newRoute)
            continue
        }

        const lastPoint = prevRoute && prevRoute.points.length > 0 ? prevRoute.points[prevRoute.points.length - 1] : null
        const moved = checkSamePosition(lastPoint, newPoint)

        if (!moved) {
            newRoutes.push(prevRoute)
            continue
        }
        prevRoute?.points.push(newPoint)
        newRoutes.push(prevRoute)
    }

    vatsimDataStorage.route = newRoutes
}

function checkSamePosition(lastPoint: RoutePoint | null, newPoint: RoutePoint): boolean {
    if (!lastPoint) return false
    return lastPoint.coordinates[0] === newPoint.coordinates[0] && lastPoint.coordinates[1] === newPoint.coordinates[1]
}

function getRoutePoint(position: PositionData): RoutePoint {
    return {
        coordinates: position.coordinates,
        altitudes: [position.altitudes[0], position.altitudes[2]],
        groundspeed: position.groundspeeds[0],
        connected: position.connected,
        timestamp: vatsimDataStorage.timestamp ? vatsimDataStorage.timestamp : new Date()
    }
}