import { AirportAPIData, FlightData, TrackData } from "@/types/vatsim"
import useSWR, { SWRConfiguration } from "swr"
import useSWRImmutable from "swr/immutable"

export const fetcher = async <T>(url: string): Promise<T> => {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Error fetching data from ${url}`)
    }
    return response.json()
}

const SWR_CONFIG: SWRConfiguration = {
    refreshInterval: 20000
}

export function useAirport(icao: string) {
    const { data, isLoading, error } = useSWR<AirportAPIData | undefined | null>(`/api/data/airport/${icao}`, fetcher, SWR_CONFIG)

    return {
        airport: data,
        isLoading,
        isError: error
    }
}

export function useFlight(callsign: string) {
    const { data, isLoading, error } = useSWR<FlightData | undefined | null>(`/api/data/flight/${callsign}`, fetcher, SWR_CONFIG)

    return {
        flight: data,
        isLoading,
        isError: error
    }
}

export function useTrack(callsign: string) {
    const { data, isLoading, error } = useSWRImmutable<TrackData | undefined | null>(`/api/data/track/${callsign}`, fetcher)

    return {
        track: data,
        isLoading,
        isError: error
    }
}