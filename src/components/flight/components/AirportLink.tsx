'use client'

import { useSliderStore } from "@/storage/state/slider"
import { Feature, GeoJsonProperties, Point } from "geojson"
import { useRouter } from "next/navigation"

export default function AirportLink({ airport }: { airport: Feature<Point, GeoJsonProperties> | undefined }) {
    const router = useRouter()
    const { setPage } = useSliderStore()

    const onClick = () => {
        const route = `/airport/${airport?.properties?.icao}`
        router.prefetch(route)
        setPage(route)
    }

    return (
        <div className="aircraft-panel-airport" onClick={onClick}>
            <div className="aircraft-panel-airport-iata">{airport?.properties?.iata ?? 'N/A'}</div>
            <div className="aircraft-panel-airport-name">{airport?.properties?.city ?? 'Not abailable'}</div>
            <div className="aircraft-panel-airport-utc">{airport ? 'UTC' : 'No times'}</div>
        </div>
    )
}