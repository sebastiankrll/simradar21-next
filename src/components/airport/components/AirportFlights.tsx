'use client'

import '../AirportFlights.css'
import { fetcher } from "@/utils/api/api";
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { checkIfNewDay } from "../utils/misc";
import { SingleFlight } from "./SingleFlight";
import Spinner from '@/components/common/spinner/Spinner';
import Delayboard from './Delayboard';
import { VatsimAirportFlightData } from '@/types/vatsim';

const FETCH_PARAMS = {
    n: 10
}

export default function AirportFlights({ icao, direction }: { icao: string, direction: string }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [timeMode, setTimeMode] = useState<boolean>(false)

    const storedFlightsRef = useRef<VatsimAirportFlightData[]>([])
    const initialFetchRef = useRef<boolean>(false) // Handle component mounting twice in strict mode
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const limitsReachedRef = useRef({
        previous: false,
        next: false
    })

    const fetchFlights = useCallback(async (pagination: 'next' | 'previous' = 'next') => {
        setLoading(true)

        const scrollDiv = scrollRef.current
        const prevScrollHeight = scrollDiv?.scrollHeight ?? 0
        const prevScrollTop = scrollDiv?.scrollTop ?? 0

        try {
            const url = new URL(`/api/data/airport/${icao}/${direction}`, window.location.origin)
            url.searchParams.append('p', pagination)
            url.searchParams.append('n', (FETCH_PARAMS.n + 1).toString())

            if (storedFlightsRef.current.length === 0) {
                url.searchParams.append('t', new Date().toISOString())
            } else {
                const edgeFlight = pagination === 'next' ? storedFlightsRef.current[storedFlightsRef.current.length - 1] : storedFlightsRef.current[0]
                const edgeTime = direction === 'departure' ? edgeFlight.status.times.schedDep : edgeFlight.status.times.schedArr
                url.searchParams.append('t', new Date(edgeTime).toISOString())
            }

            const flights = await fetcher(url.toString()) as VatsimAirportFlightData[] | null
            if (!flights || flights.length < 1) return
            if (flights.length < 11) { limitsReachedRef.current[pagination] = true }

            if (pagination === 'previous' && scrollDiv) {
                flights.shift()
                storedFlightsRef.current = [...flights, ...storedFlightsRef.current]

                setTimeout(() => {
                    const newScrollHeight = scrollDiv.scrollHeight
                    scrollDiv.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight)
                }, 0)
            } else {
                flights.pop()
                storedFlightsRef.current = pagination === 'next' ? [...storedFlightsRef.current, ...flights] : [...flights, ...storedFlightsRef.current]
            }
        } catch (error) {
            console.error('Error fetching flights:', error)
        } finally {
            setLoading(false)
        }
    }, [icao, direction])

    const renderFlights = () => {
        if (storedFlightsRef.current.length < 1) return

        let latestDay = new Date(0)

        return storedFlightsRef.current.map(flight => {
            const date = direction === 'departure' ? new Date(flight.status.times.schedDep) : new Date(flight.status.times.schedArr)
            const isNewDay = checkIfNewDay(latestDay, date)

            const uid = flight.general.index.callsign + '_' + flight.general.index.hash

            if (isNewDay) {
                latestDay = date
                return (
                    <Fragment key={uid}>
                        {DateSeparator(date, direction)}
                        <SingleFlight data={flight} timeMode={timeMode} direction={direction} />
                    </Fragment>
                )
            }

            return <SingleFlight key={uid} data={flight} timeMode={timeMode} direction={direction} />
        })
    }

    useEffect(() => {
        const timeModeInterval = setInterval(() => {
            setTimeMode(prev => !prev)
        }, 2000)

        return () => {
            clearInterval(timeModeInterval)
        }
    }, [])

    useEffect(() => {
        if (!initialFetchRef.current) {
            fetchFlights()
            initialFetchRef.current = true
        }
    }, [fetchFlights])

    return (
        <>
            <Delayboard icao={icao} direction={direction} />
            <div className="info-panel-container column main scrollable" ref={scrollRef}>
                {loading && <div className='loader-absolute overlay'><Spinner show={loading} /></div>}
                {!limitsReachedRef.current.previous && <button className="airport-flights-pagination" onClick={() => fetchFlights('previous')}>Load earlier flights</button>}
                <div className="airport-flights-wrapper">
                    {storedFlightsRef.current.length > 0 ?
                        renderFlights() :
                        <p>No flights found. Try earlier flights.</p>
                    }
                </div>
                {(storedFlightsRef.current.length !== 0 && !limitsReachedRef.current.next) && <button className="airport-flights-pagination" onClick={() => fetchFlights('next')}>Load later flights</button>}
            </div>
        </>
    )
}

function DateSeparator(date: Date, direction: string) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-US', options).toUpperCase()
    const prefix = direction === 'departures' ? 'DEPARTURES - ' : 'ARRIVALS - '

    return (
        <div className="airport-flights-dateline">
            {prefix + formattedDate}
        </div>
    )
}