'use client'

import { FlightData, StatusFlightData } from "@/types/panel"

export default function RouteProgress({ data, flightStatus }: { data: FlightData, flightStatus: StatusFlightData }) {
    if (!data) return

    return (
        <div id="aircraft-panel-progress">
            <div id="aircraft-panel-progressbar">
                <div id="aircraft-panel-progressbar-value" style={{ width: flightStatus.progress + '%' }}></div>
                <div id="aircraft-panel-progressbar-icon" style={{ left: Math.max(Math.min(flightStatus.progress, 98), 2) + '%' }}></div>
            </div>
            <div className="aircraft-panel-progress-data">
                <div>{flightStatus.startToEnd[0]}</div>
                <div>{flightStatus.startToEnd[1]}</div>
            </div>
        </div>
    )
}