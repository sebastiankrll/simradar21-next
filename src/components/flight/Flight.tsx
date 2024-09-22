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
import { useEffect, useState } from 'react'
import { getFlightStatus } from './utils/update'
import { onMessage } from '@/utils/ws'
import { useFlightStore } from '@/storage/zustand/flight'

export default function Flight({ data }: { data: FlightData }) {
    const [flightData, setFlightData] = useState<FlightData>(data)
    const setTrackData = useFlightStore((state) => state.setTrackData)

    useEffect(() => {
        const callsign = flightData.general?.index.callsign
        const unMessage = onMessage(async () => {
            const res = await fetch('/api/data/flight/' + callsign)
            const data = await res.json()
            setFlightData(data.data as FlightData)
        })
        setTrackData(data.track?.points ?? null)

        return () => {
            unMessage()
        }
    }, [])

    if (!flightData) return

    const flightStatus = getFlightStatus(flightData)

    return (
        <div className='info-panel'>
            <div className="info-panel-container header">
                <div className='info-panel-id'>{flightData.position?.callsign}</div>
                <CloseButton />
            </div>
            <div className="info-panel-container">
                <div className="info-panel-title-main">
                    <figure className="info-panel-title-logo">
                        <Image src={'https://images.kiwi.com/airlines/64/' + flightData.general?.airline.iata + '.png'} alt={`${flightData.general?.airline.iata}.png`} width={64} height={64} />
                    </figure>
                    <div className="info-panel-title-desc">{flightData.general?.airline.name}</div>
                    <div className="info-panel-title-content">
                        <div className="info-panel-title-content-item">
                            <div className="info-panel-title-content-icon">
                                #
                            </div>
                            <div className="info-panel-title-content-text">{flightData.general?.airline.flightno}</div>
                        </div>
                        <div className="info-panel-title-content-item">
                            <div className="info-panel-title-content-icon">
                                A
                            </div>
                            <div className="info-panel-title-content-text">{flightData.general?.aircraft?.icao}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="info-panel-container column">
                <div id="aircraft-panel-route">
                    <AirportLink airport={flightData.general?.airport?.dep} />
                    <div id='aircraft-panel-airport-line'></div>
                    <div id="aircraft-panel-route-logo">
                        <figure style={{
                            backgroundImage: `url(${FlightStatusSprite.src})`,
                            backgroundPositionY: flightStatus.imgOffset + 'px'
                        }}></figure>
                    </div>
                    <AirportLink airport={flightData.general?.airport?.arr} />
                </div>
                {flightData.status?.progress &&
                    <>
                        <TimeSlots data={flightData} flightStatus={flightStatus} />
                        <RouteProgress data={flightData} flightStatus={flightStatus} />
                    </>
                }
            </div>
            <MainInfo data={flightData} />
            <Footer data={flightData} />
        </div>
    )
}