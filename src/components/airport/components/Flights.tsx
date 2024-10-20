import { AirportFlight, FlightsSearchParam } from "@/types/panel";
import { fetcher } from "@/utils/api/api";
import { Fragment, useRef, useState } from "react"
import { checkIfNewDay } from "../utils/misc";
import { SingleFlight } from "./SingleFlight";

export default function Flights({ icao, direction }: { icao: string, direction: string }) {
    const [storedFlights, setStoredFlights] = useState<AirportFlight[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [timeMode, setTimeMode] = useState<boolean>(false)

    const searchParamsRef = useRef<FlightsSearchParam>({
        pagination: 'next',
        icao: icao,
        direction: direction,
        timestamp: new Date(),
        n: 10
    })

    const fetchFlights = async (pagination: 'next' | 'previous' = 'next') => {
        setLoading(true)

        try {
            const url = new URL(`/api/flights`, window.location.origin)
            url.searchParams.append('p', pagination)
            url.searchParams.append('n', searchParamsRef.current.n.toString())
            url.searchParams.append('t', searchParamsRef.current.timestamp.toUTCString())

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

    return (
        <>
            <div className="info-panel-container column">
                {/* {storedFlights ? <DelayBoard /> : null} */}
            </div>
            <div className="info-panel-container column main scrollable">
                <button className="flights-page-pagination" onClick={() => fetchFlights('previous')}>{storedFlights.length > 0 ? 'Load earlier flights' : 'No flights found'}</button>
                <div className="flights-page-wrapper">
                    {renderFlights()}
                </div>
                <button className="flights-page-pagination" onClick={() => fetchFlights('next')}>{storedFlights.length > 0 ? 'Load later flights' : 'No flights found'}</button>
            </div>
        </>
    )
}

function DateSeparator(date: Date, direction: string) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-US', options).toUpperCase()
    const prefix = direction === 'departures' ? 'DEPARTURES - ' : 'ARRIVALS - '

    return (
        <div className="flights-page-dateline">
            {prefix + formattedDate}
        </div>
    )
}