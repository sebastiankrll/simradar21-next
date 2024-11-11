'use client'

import { FlightPanelStatusData } from "@/types/panel"
import { VatsimFlightData } from "@/types/vatsim"

export default function RouteProgress({ data, flightStatus }: { data: VatsimFlightData, flightStatus: FlightPanelStatusData }) {
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