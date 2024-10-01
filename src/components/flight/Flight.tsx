'use client'

import './Flight.css'
import './freakflags.css'
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
import { useEffect } from 'react'
import { useFlightStore } from '@/storage/zustand/flight'
import { TrackData } from '@/types/vatsim'
import { useRouter } from 'next/navigation'
import { useSliderStore } from '@/storage/zustand/slider'

export default function Flight({ callsign }: { callsign: string }) {
    const router = useRouter()
    const { data: flightData, isLoading } = useSWR<FlightData | undefined | null>(`/api/data/flight/${callsign}`, fetcher, {
        refreshInterval: 20000
    })
    const { data: trackData } = useSWR<TrackData | undefined | null>(`/api/data/track/${callsign}`, fetcher, {
        revalidateOnFocus: false
    })
    const { setTrackPoints, setAction } = useFlightStore()
    const {setPage} = useSliderStore()
    const flightStatus = getFlightStatus(flightData)

    const clickClose = () => {
        setAction(null)
        setPage('/')
        router.prefetch('/')
    }

    useEffect(() => {
        setTrackPoints(trackData?.points ?? null)

        return () => {
            setTrackPoints(null)
        }
    }, [trackData, setTrackPoints])

    return (
        <div className='info-panel'>
            <Spinner show={isLoading} />
            <div className="info-panel-container header">
                <div className='info-panel-id'>{callsign}</div>
                <CloseButton onButtonClick={clickClose} />
            </div>
            <div className="info-panel-container">
                <div className="info-panel-title-main">
                    <figure className="info-panel-title-logo">
                        <Image src={'https://images.kiwi.com/airlines/64/' + flightData?.general?.airline.iata + '.png'} alt={`${flightData?.general?.airline.iata}.png`} width={64} height={64} />
                    </figure>
                    <div className="info-panel-title-desc">{flightData?.general?.airline.name}</div>
                    <div className="info-panel-title-content">
                        <div className="info-panel-title-content-item">
                            <div className="info-panel-title-content-icon">
                                #
                            </div>
                            <div className="info-panel-title-content-text">{flightData?.general?.airline.flightno}</div>
                        </div>
                        <div className="info-panel-title-content-item">
                            <div className="info-panel-title-content-icon">
                                A
                            </div>
                            <div className="info-panel-title-content-text">{flightData?.general?.aircraft?.icao}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="info-panel-container column">
                <div id="aircraft-panel-route">
                    <AirportLink airport={flightData?.general?.airport?.dep} />
                    <div id='aircraft-panel-airport-line'></div>
                    <div id="aircraft-panel-route-logo">
                        <figure style={{
                            backgroundImage: `url(${FlightStatusSprite.src})`,
                            backgroundPositionY: flightStatus.imgOffset + 'px'
                        }}></figure>
                    </div>
                    <AirportLink airport={flightData?.general?.airport?.arr} />
                </div>
                {flightData?.status?.progress &&
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