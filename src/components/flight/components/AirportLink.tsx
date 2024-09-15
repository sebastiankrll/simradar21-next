'use client'

import { Feature, GeoJsonProperties, Point } from "geojson"

function clickAirport(icao: string) {
    // Navigate to airport path
}

export default function AirportLink({ airport }: { airport: Feature<Point, GeoJsonProperties> | undefined }) {
    return (
        <div className="aircraft-panel-airport" onClick={() => clickAirport(airport?.properties?.icao)}>
            <div className="aircraft-panel-airport-iata">{airport?.properties?.iata ?? 'N/A'}</div>
            <div className="aircraft-panel-airport-name">{airport?.properties?.city ?? 'Not abailable'}</div>
            <div className="aircraft-panel-airport-utc">{airport ? 'UTC' : 'No times'}</div>
        </div>
    )
}