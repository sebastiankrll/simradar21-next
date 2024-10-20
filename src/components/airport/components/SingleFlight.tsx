import { AirportFlight } from "@/types/panel"
import { getUtcString } from "@/utils/common"
import { getFlightDelayColor, getFlightTimesArray } from "../utils/misc"

export function SingleFlight({ data, timeMode, direction }: { data: AirportFlight, timeMode: boolean, direction: string }) {

    const clickOpen = () => {
        // navigate(`/flight/${flight.callsign}`)
    }

    const timesArray = getFlightTimesArray(data, direction)

    // onMouseEnter={() => setHoveredFlight(flight.callsign)} onMouseLeave={() => setHoveredFlight(null)}

    return (
        <div className="flights-page-flight" onClick={clickOpen} style={{ borderLeft: '5px solid ' + getFlightDelayColor(data, direction) }}>
            <figure className="flights-page-airline">
                <img src={'https://images.kiwi.com/airlines/64/' + data.general.airline.iata + '.png'} alt="" />
            </figure>
            <div className="flights-page-status">
                <div className="flights-page-airport-name">{direction === 'departure' ? data.general.airport?.arr.properties?.city : data.general.airport?.dep.properties?.city}</div>
                <div className="flights-page-airport-flightno">{data.general.index.callsign}</div>
            </div>
            <div className="flights-page-status-short">
                <div className="flights-page-airport-iata">{direction === 'departure' ? data.general.airport?.arr.properties?.iata : data.general.airport?.dep.properties?.iata}</div>
                <div className="flights-page-airport-ac">{data.general.aircraft?.icao}</div>
            </div>
            <div className="flights-page-times">
                <div className="flights-page-times-sched">{direction === 'departure' ? getUtcString(data.status.times.schedDep) : getUtcString(data.status.times.schedArr)}</div>
                <div className="flights-page-times-act">{timeMode ? timesArray[0] : timesArray[1]}</div>
            </div>
        </div>
    )
}