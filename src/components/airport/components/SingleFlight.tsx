import { AirportFlight } from "@/types/panel"
import { getUtcString } from "@/utils/common"
import { getFlightDelayColor, getFlightTimesArray } from "../utils/misc"
import { useFlightStore } from "@/storage/state/flight"
import { useRouter } from "next/navigation"
import { useSliderStore } from "@/storage/state/slider"

export function SingleFlight({ data, timeMode, direction }: { data: AirportFlight, timeMode: boolean, direction: string }) {
    const { setAction } = useFlightStore()
    const { setPage } = useSliderStore()
    const router = useRouter()

    const onClick = () => {
        const route = `/flight/${data.general.index.callsign}`
        router.prefetch(route)
        setPage(route)
    }

    const onHover = () => {
        setAction(data.general.index.callsign)
    }

    const timesArray = getFlightTimesArray(data, direction)

    return (
        <div className="airport-flights-flight" onClick={onClick} style={{ borderLeft: '5px solid ' + getFlightDelayColor(data, direction) }} onMouseEnter={onHover} onMouseLeave={onHover}>
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