import { Feature } from "ol"
import { LiveFlightData } from "./flight"
import { TrackPoint } from "./vatsim"

export type FlightState = {
    feature: Feature | null,
    liveData: LiveFlightData | null,
    trackPoints: TrackPoint[] | null,
    timer: ReturnType<typeof setInterval> | null
}

export type FlightActions = {
    updateLiveData: (feature: Feature | null) => void
    resetLiveData: () => void
    setTrackPoints: (points: TrackPoint[] | null) => void
    resetTrackPoints: () => void
}

export type FlightStore = FlightState & FlightActions