'use client'

import Chart from "@/components/common/chart/Chart";
import { getFlightChartData } from "../utils/chart";
import { useFlightStore } from "@/storage/zustand/flight";

export default function AttitudeChart({ }) {
    const trackData = useFlightStore((state) => state.trackData)

    return (
        <div className="info-panel-container-content" id='aircraft-panel-graph'>
            <Chart param={getFlightChartData(trackData)} />
        </div>
    )
}