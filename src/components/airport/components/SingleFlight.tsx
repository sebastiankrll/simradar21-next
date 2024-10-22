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
        <div className="airport-flights-flight" onClick={clickOpen} style={{ borderLeft: '5px solid ' + getFlightDelayColor(data, direction) }}>
            <figure className="airport-flights-airline">
                <img src={'https://images.kiwi.com/airlines/64/' + data.general.airline.iata + '.png'} alt="" />
            </figure>
            <div className="airport-flights-status">
                <div className="airport-flights-airport-name">{direction === 'departure' ? data.general.airport?.arr.properties?.city : data.general.airport?.dep.properties?.city}</div>
                <div className="airport-flights-airport-flightno">{data.general.index.callsign}</div>
            </div>
            <div className="airport-flights-status-short">
                <div className="airport-flights-airport-iata">{direction === 'departure' ? data.general.airport?.arr.properties?.iata : data.general.airport?.dep.properties?.iata}</div>
                <div className="airport-flights-airport-ac">{data.general.aircraft?.icao}</div>
            </div>
            <div className="airport-flights-times">
                <div className="airport-flights-times-sched">{direction === 'departure' ? getUtcString(data.status.times.schedDep) : getUtcString(data.status.times.schedArr)}</div>
                <div className="airport-flights-times-act">{timeMode ? timesArray[0] : timesArray[1]}</div>
            </div>
        </div>
    )
}