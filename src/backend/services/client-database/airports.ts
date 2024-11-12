import airportsJSON from '@/assets/data/airports_short.json'
import { Feature, FeatureCollection, Point } from 'geojson'

interface AirportsFeatureCollection extends FeatureCollection<Point> {
    version: string
}

const airports = airportsJSON as AirportsFeatureCollection

export function updateAirports(version: string): { version: string, data: Feature<Point>[] } {
    const newVersion = airports.version
    if (!newVersion) return { version: version, data: [] }

    return { version: newVersion, data: airports.features }
}