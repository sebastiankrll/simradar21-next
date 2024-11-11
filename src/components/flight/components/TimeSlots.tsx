'use client'

import { FlightPanelStatusData } from "@/types/panel"
import { VatsimFlightData } from "@/types/vatsim"
import { getUtcString } from "@/utils/common"

export default function TimeSlots({ data, flightStatus }: { data: VatsimFlightData, flightStatus: FlightPanelStatusData }) {
    if (!data?.status) return

    return (
        <div id="aircraft-panel-slots">
            <div className="aircraft-panel-slot-time">
                <p>{getUtcString(data.status?.times.schedDep)}</p>
                <p>{getUtcString(data.status?.times.actDep)}</p>
            </div>
            <div className="aircraft-panel-slot-desc">
                <p className='r'>SCHED</p>
                <p>SCHED</p>
                <p className='r'>{flightStatus.depStatus}</p>
                <p>{flightStatus.arrStatus}</p>
            </div>
            <div className="aircraft-panel-slot-time">
                <p>{getUtcString(data.status.times.schedArr)}</p>
                <p className={`aircraft-panel-act-arr-status ${flightStatus.delayColor ?? null}`}>{getUtcString(data.status.times.actArr)}</p>
            </div>
        </div>
    )
}