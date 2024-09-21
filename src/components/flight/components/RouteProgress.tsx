'use client'

import { FlightData, StatusFlightData } from "@/types/flight"
import { useRef } from "react"
import { getFlightStatus } from "../utils/update"

export default function RouteProgress({ data }: { data: FlightData }) {
    const flightStatusRef = useRef<StatusFlightData>(getFlightStatus(data, null))

    if (!data) return

    return (
        <div id="aircraft-panel-progress">
            <div id="aircraft-panel-progressbar">
                <div id="aircraft-panel-progressbar-value" style={{ width: flightStatusRef.current?.progress + '%' }}></div>
                <div id="aircraft-panel-progressbar-icon" style={{ left: Math.max(Math.min(flightStatusRef.current.progress, 98), 2) + '%' }}></div>
            </div>
            <div className="aircraft-panel-progress-data">
                <div>{flightStatusRef.current.startToEnd[0]}</div>
                <div>{flightStatusRef.current.startToEnd[1]}</div>
            </div>
        </div>
    )
}