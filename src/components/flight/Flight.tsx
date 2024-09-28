'use client'

import './Flight.css'
import './freakflags.css'
import '../common/panel/Panel.css'
import CloseButton from '../common/panel/CloseButton'
import AirportLink from './components/AirportLink'
import TimeSlots from './components/TimeSlots'
import RouteProgress from './components/RouteProgress'
import { FlightData } from '@/types/flight'
import MainInfo from './components/MainInfo'
import Footer from './components/Footer'
import Image from 'next/image'
import FlightStatusSprite from '@/assets/images/sprites/flightstatusSprite.png'
import { getFlightStatus } from './utils/update'
import useSWR from 'swr'
import { fetcher } from '@/utils/api'
import Spinner from '../common/spinner/Spinner'

export default function Flight({ callsign }: { callsign: string }) {
    const { data } = useSWR<FlightData>(`/api/data/flight/${callsign}`, fetcher, {
        refreshInterval: 20000,
    })

    if (!data) return (
        <div className='info-panel'>
            <Spinner />
        </div>
    )

    const flightStatus = getFlightStatus(data)

    return (
        <div className='info-panel'>
            <div className="info-panel-container header">
                <div className='info-panel-id'>{data.position?.callsign}</div>
                <CloseButton />
            </div>
            <div className="info-panel-container">
                <div className="info-panel-title-main">
                    <figure className="info-panel-title-logo">
                        <Image src={'https://images.kiwi.com/airlines/64/' + data.general?.airline.iata + '.png'} alt={`${data.general?.airline.iata}.png`} width={64} height={64} />
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
            </div>
            <div className="info-panel-container column">
                <div id="aircraft-panel-route">
                    <AirportLink airport={data.general?.airport?.dep} />
                    <div id='aircraft-panel-airport-line'></div>
                    <div id="aircraft-panel-route-logo">
                        <figure style={{
                            backgroundImage: `url(${FlightStatusSprite.src})`,
                            backgroundPositionY: flightStatus.imgOffset + 'px'
                        }}></figure>
                    </div>
                    <AirportLink airport={data.general?.airport?.arr} />
                </div>
                {data.status?.progress &&
                    <>
                        <TimeSlots data={data} flightStatus={flightStatus} />
                        <RouteProgress data={data} flightStatus={flightStatus} />
                    </>
                }
            </div>
            <MainInfo data={data} />
            <Footer data={data} />
        </div>
    )
}