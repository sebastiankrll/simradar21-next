import './Flight.css'
import '../common/panel/Panel.css'
import CloseButton from '../common/panel/CloseButton'
import AirportLink from './components/AirportLink'
import TimeSlots from './components/TimeSlots'
import RouteProgress from './components/RouteProgress'
import { FlightData } from '@/types/data/vatsim'

export default function Aircraft({ data }: { data: FlightData }) {
    return (
        <div className='info-panel'>
            <div className="info-panel-container header">
                <div className='info-panel-id'>{data.position?.callsign}</div>
                <CloseButton />
            </div>
            <div className="info-panel-container">
                <div className="info-panel-title-main">
                    <figure className="info-panel-title-logo">
                        <img src={'https://images.kiwi.com/airlines/64/' + data.general?.airline.iata + '.png'} alt="" />
                    </figure>
                    <div className="info-panel-title-desc">{data.general?.airline.name}</div>
                    <div className="info-panel-title-content">
                        <div className="info-panel-title-content-item">
                            <div className="info-panel-title-content-icon">
                                #
                            </div>
                            <div className="info-panel-title-content-text">{data.general?.airline.flightno}</div>
                        </div>
                        <div className="info-panel-title-content-item">
                            <div className="info-panel-title-content-icon">
                                A
                            </div>
                            <div className="info-panel-title-content-text">{data.general?.aircraft?.icao}</div>
                        </div>
                    </div>
                </div>
                {/* <figure className="info-panel-image-fig">
                    <img src='/assets/img/placeholder.jpeg' alt="" />
                </figure> */}
            </div>
            <div className="info-panel-container column">
                <div id="aircraft-panel-route">
                    <AirportLink airport={data.general?.airport?.dep} />
                    <div id='aircraft-panel-airport-line'></div>
                    <figure id="aircraft-panel-route-logo">
                        <svg>
                            <use href={`/assets/img/sprites/flightstatus_sprite.svg#${'climb'}`} />
                        </svg>
                    </figure>
                    <AirportLink airport={data.general?.airport?.arr} />
                </div>
                <TimeSlots status={data.status} />
                <RouteProgress status={data.status} />
            </div>
        </div>
    )
}