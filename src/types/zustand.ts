import { Feature } from "ol"
import { LiveFlightData } from "./flight"
import { TrackPoint } from "./vatsim"

export type FlightState = {
    feature: Feature | null,
    liveData: LiveFlightData | null,
    trackData: TrackPoint[] | null,
    timer: ReturnType<typeof setInterval> | null
}

export type FlightActions = {
    updateLiveData: (feature: Feature | null) => void
    resetLiveData: () => void
    setTrackData: (points: TrackPoint[] | null) => void
}

export type FlightStore = FlightState & FlightActions