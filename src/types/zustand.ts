import { Feature } from "ol"
import { LiveFlightData } from "./flight"

export type FlightState = {
    feature: Feature | null,
    liveData: LiveFlightData | null,
    timer: ReturnType<typeof setInterval> | null
}

export type FlightActions = {
    updateData: (feature: Feature | null) => void
    resetData: () => void
}

export type FlightStore = FlightState & FlightActions