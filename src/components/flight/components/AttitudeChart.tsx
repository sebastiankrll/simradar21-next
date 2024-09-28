'use client'

import Chart from "@/components/common/chart/Chart";
import { flightChartConfig, setFlightChartData, updateFlightChartData } from "../utils/chart";
import { useFlightStore } from "@/storage/zustand/flight";
import { useEffect } from "react";
import { FlightData } from "@/types/flight";

export default function AttitudeChart({ data }: { data: FlightData | null }) {
    const { trackPoints } = useFlightStore()

    useEffect(() => {
        setFlightChartData(trackPoints)
    }, [trackPoints])

    useEffect(() => {
        updateFlightChartData(data)
    }, [data])

    return (
        <div className="info-panel-container-content" id='aircraft-panel-graph'>
            <Chart param={flightChartConfig} />
        </div>
    )
}