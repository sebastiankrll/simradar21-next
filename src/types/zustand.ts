import { Feature } from "ol"
import { LiveFlightData } from "./flight"
import { TrackPoint } from "./vatsim"

export type FlightState = {
    feature: Feature | null,
    action: number | null,
    liveData: LiveFlightData | null,
    trackPoints: TrackPoint[] | null,
    timer: ReturnType<typeof setInterval> | null
}

export type FlightActions = {
    setAction: (id: number | null) => void
    setLiveData: (feature: Feature | null) => void
    setTrackPoints: (points: TrackPoint[] | null) => void
}

export type FlightStore = FlightState & FlightActions

export type SliderState = {
    page: string
}

export type SliderActions = {
    setPage: (newPage: string) => void
}

export type SliderStore = SliderState & SliderActions