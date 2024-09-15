'use client'

import { StatusData } from "@/types/data/vatsim"

export default function RouteProgress({ status }: { status: StatusData | null }) {
    if (!status) return
    return (
        <div id="aircraft-panel-progress" style={{ display: status.progress ? '' : 'none' }}>
            <div id="aircraft-panel-progressbar">
                <div id="aircraft-panel-progressbar-value" style={{ width: 0 + '%' }}></div>
                <div id="aircraft-panel-progressbar-icon" style={{ left: Math.max(Math.min(0, 98), 2) + '%' }}></div>
            </div>
            <div className="aircraft-panel-progress-data">
                <div>{''}</div>
                <div>{''}</div>
            </div>
        </div>
    )
}