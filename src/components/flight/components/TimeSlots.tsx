'use client'

import { FlightData, StatusFlightData } from "@/types/flight"
import { getUtcString } from "@/utils/common"
import { useRef } from "react"
import { getFlightStatus } from "../utils/update"

export default function TimeSlots({ data }: { data: FlightData }) {
    const flightStatusRef = useRef<StatusFlightData>(getFlightStatus(data, null))

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
                <p className='r'>{flightStatusRef.current.depStatus}</p>
                <p>{flightStatusRef.current.arrStatus}</p>
            </div>
            <div className="aircraft-panel-slot-time">
                <p>{getUtcString(data.status.times.schedArr)}</p>
                <p className={`aircraft-panel-act-arr-status ${flightStatusRef.current.delayColor ?? null}`}>{getUtcString(data.status.times.actArr)}</p>
            </div>
        </div>
    )
}