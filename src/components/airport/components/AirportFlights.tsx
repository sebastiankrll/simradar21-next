'use client'

import '../AirportFlights.css'
import { AirportFlight } from "@/types/panel";
import { fetcher } from "@/utils/api/api";
import { Fragment, useEffect, useRef, useState } from "react"
import { checkIfNewDay } from "../utils/misc";
import { SingleFlight } from "./SingleFlight";
import Spinner from '@/components/common/spinner/Spinner';
import Delayboard from './Delayboard';

export default function AirportFlights({ icao, direction }: { icao: string, direction: string }) {
    const [storedFlights, setStoredFlights] = useState<AirportFlight[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [timeMode, setTimeMode] = useState<boolean>(false)

    const initialFetchRef = useRef(false) // Handle component mounting twice in strict mode

    useEffect(() => {
        const timeModeInterval = setInterval(() => {
            setTimeMode(prev => !prev)
        }, 2000)

        if (!initialFetchRef.current) {
            fetchFlights()
            initialFetchRef.current = true
        }

        return () => {
            clearInterval(timeModeInterval)
        }
    }, [])

    const fetchFlights = async (pagination: 'next' | 'previous' = 'next') => {
        setLoading(true)

        try {
            const url = new URL(`/api/data/airport/${icao}/${direction}`, window.location.origin)
            url.searchParams.append('p', pagination)
            url.searchParams.append('n', "10")
            if (storedFlights.length === 0) {
                url.searchParams.append('t', new Date().toISOString())
            } else {
                const edgeFlight = pagination === 'next' ? storedFlights[storedFlights.length - 1] : storedFlights[0]
                const edgeTime = direction === 'departure' ? edgeFlight.status.times.schedDep : edgeFlight.status.times.schedArr
                url.searchParams.append('t', new Date(edgeTime).toISOString())
            }

            const flights = await fetcher(url.toString()) as AirportFlight[] | null

            if (flights) {
                setStoredFlights((prev) =>
                    pagination === 'next' ? [...prev, ...flights] : [...flights, ...prev]
                )
            }
        } catch (error) {
            console.error('Error fetching flights:', error)
        } finally {
            setLoading(false)
        }
    }

    const renderFlights = () => {
        if (storedFlights.length < 1) return 'No flights'

        let latestDay = new Date(0)

        return storedFlights.map(flight => {
            const date = direction === 'departure' ? new Date(flight.status.times.schedDep) : new Date(flight.status.times.schedArr)
            const isNewDay = checkIfNewDay(latestDay, date)

            if (isNewDay) {
                latestDay = date
                return (
                    <Fragment key={flight.general.index.hash}>
                        {DateSeparator(date, direction)}
                        <SingleFlight data={flight} timeMode={timeMode} direction={direction} />
                    </Fragment>
                )
            }

            return <SingleFlight key={flight.general.index.hash} data={flight} timeMode={timeMode} direction={direction} />
        })
    }

    if (loading) return <Spinner show={true} />

    return (
        <>
            <Delayboard icao={icao} direction={direction} />
            <div className="info-panel-container column main scrollable">
                <button className="airport-flights-pagination" onClick={() => fetchFlights('previous')}>{storedFlights.length > 0 ? 'Load earlier flights' : 'No flights found'}</button>
                <div className="airport-flights-wrapper">
                    {renderFlights()}
                </div>
                <button className="airport-flights-pagination" onClick={() => fetchFlights('next')}>{storedFlights.length > 0 ? 'Load later flights' : 'No flights found'}</button>
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