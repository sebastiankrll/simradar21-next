'use client'

import { StatusData } from "@/types/data/vatsim"
import { getUtcString } from "@/utils/common"

export default function TimeSlots({ status }: { status: StatusData | null }) {
    if (!status) return
    return (
        <div id="aircraft-panel-slots" style={{ display: status?.times ? '' : 'none' }}>
            <div className="aircraft-panel-slot-time">
                <p>{getUtcString(status.times.schedDep)}</p>
                <p>{getUtcString(status.times.actDep)}</p>
            </div>
            <div className="aircraft-panel-slot-desc">
                <p className='r'>SCHED</p>
                <p>SCHED</p>
                <p className='r'>{''}</p>
                <p>{''}</p>
            </div>
            <div className="aircraft-panel-slot-time">
                <p>{getUtcString(status.times.schedArr)}</p>
                <p className={`aircraft-panel-act-arr-status ${'' ?? null}`}>{getUtcString(status.times.actArr)}</p>
            </div>
        </div>
    )
}