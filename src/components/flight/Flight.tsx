'use client'

import './Flight.css'
import './freakflags.css'
import CloseButton from '../common/panel/CloseButton'
import AirportLink from './components/AirportLink'
import TimeSlots from './components/TimeSlots'
import RouteProgress from './components/RouteProgress'
import MainInfo from './components/MainInfo'
import Footer from './components/Footer'
import FlightStatusSprite from '@/assets/images/sprites/flightstatusSprite.png'
import { getFlightStatus } from './utils/update'
import { useFlight, useTrack } from '@/utils/api/api'
import Spinner from '../common/spinner/Spinner'
import { useEffect } from 'react'
import { useFlightStore } from '@/storage/zustand/panel'
import { useRouter } from 'next/navigation'
import { useSliderStore } from '@/storage/zustand/slider'
import Marquee from '../common/marquee/Marquee'

export default function Flight({ callsign }: { callsign: string }) {
    const router = useRouter()
    const { flight, isLoading } = useFlight(callsign)
    const { track } = useTrack(callsign)
    const { setTrackPoints, setAction } = useFlightStore()
    const { setPage } = useSliderStore()
    const flightStatus = getFlightStatus(flight)

    const clickClose = () => {
        setAction(null)
        setPage('/')
        router.prefetch('/')
    }

    useEffect(() => {
        setTrackPoints(track?.points ?? null)

        return () => {
            setTrackPoints(null)
        }
    }, [track, setTrackPoints])

    if (isLoading) return (
        <div className='info-panel loading'>
            <Spinner show={true} />
        </div>
    )

    return (
        <div className='info-panel'>
            <div className="info-panel-container header">
                <div className='info-panel-id'>{callsign}</div>
                <CloseButton onButtonClick={clickClose} />
            </div>
            <div className="info-panel-container">
                <div className="info-panel-title-main">
                    <figure className="info-panel-title-logo" style={{ backgroundColor: flight?.position?.airline?.bg ?? '' }}>
                        <p style={{
                            color: flight?.position?.airline?.font ?? '',
                            fontSize: flight?.position?.airline.iata.length && flight.position.airline.iata.length > 2 ? '1.2rem' : ''
                        }}>
                            {flight?.position?.airline?.iata}
                        </p>
                    </figure>
                    <Marquee>
                        <div className="info-panel-title-desc">{flight?.general?.airline.name}</div>
                    </Marquee>
                    <div className="info-panel-title-content">
                        <div className="info-panel-title-content-item">
                            <div className="info-panel-title-content-icon">
                                #
                            </div>
                            <div className="info-panel-title-content-text">{flight?.general?.airline.flightno}</div>
                        </div>
                        <div className="info-panel-title-content-item">
                            <div className="info-panel-title-content-icon">
                                A
                            </div>
                            <div className="info-panel-title-content-text">{flight?.general?.aircraft?.icao}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="info-panel-container column">
                <div id="aircraft-panel-route">
                    <AirportLink airport={flight?.general?.airport?.dep} />
                    <div id='aircraft-panel-airport-line'></div>
                    <div id="aircraft-panel-route-logo">
                        <figure style={{
                            backgroundImage: `url(${FlightStatusSprite.src})`,
                            backgroundPositionY: flightStatus.imgOffset + 'px'
                        }}></figure>
                    </div>
                    <AirportLink airport={flight?.general?.airport?.arr} />
                </div>
                {flight?.status?.progress &&
                    <>
                        <TimeSlots data={flight} flightStatus={flightStatus} />
                        <RouteProgress data={flight} flightStatus={flightStatus} />
                    </>
                }
            </div>
            <MainInfo data={flight} />
            <Footer data={flight} />
        </div>
    )
}