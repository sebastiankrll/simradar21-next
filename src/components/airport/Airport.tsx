'use client'

import './Airport.css'
import { useSliderStore } from '@/storage/state/slider'
import CloseButton from '../common/panel/CloseButton'
import { useRouter } from 'next/navigation'
import { getSelectedAirports } from '@/storage/client-database'
import { useEffect, useState } from 'react'
import { Feature, Point } from 'geojson'
import Footer from './components/Footer'
import { useAirport } from '@/utils/api/api'
import Spinner from '../common/spinner/Spinner'
import { getAirportTime } from './utils/misc'
import Marquee from '../common/marquee/Marquee'

export default function Airport({ icao, children }: { icao: string, children: React.ReactNode }) {
    const router = useRouter()
    const { setPage } = useSliderStore()
    const { airport, isLoading } = useAirport(icao)
    const [feature, setFeature] = useState<Feature<Point> | null>(null)
    const [time, setTime] = useState<string>('N/A')

    useEffect(() => {
        initAirportFeature()
    }, [])

    useEffect(() => {
        setTime(getAirportTime(airport))
        const interval = setInterval(() => {
            setTime(getAirportTime(airport))
        }, 1000)

        return () => clearInterval(interval)
    }, [airport])

    const initAirportFeature = async () => {
        const feature = await getSelectedAirports([icao])
        if (!feature) return

        setFeature(feature[0])
    }

    const clickClose = () => {
        setPage('/')
        router.prefetch('/')
    }

    if (isLoading) return (
        <div className='info-panel loading'>
            <Spinner show={true} />
        </div>
    )

    return (
        <div className='info-panel'>
            <div className="info-panel-container header">
                <div className='info-panel-id'>{icao}{feature?.properties?.iata ? ` - ${feature?.properties?.iata}` : ''}</div>
                <CloseButton onButtonClick={clickClose} />
            </div>
            <div className="info-panel-container">
                <div className="info-panel-title-main">
                    <figure className='info-panel-title-logo'>
                        <p style={{ fontSize: feature?.properties?.iata !== '' ? '1.2rem' : '.9rem' }}>{feature?.properties?.iata !== '' ? feature?.properties?.iata : icao}</p>
                    </figure>
                    <Marquee>
                        <div className='info-panel-title-desc'>{feature?.properties?.name}</div>
                    </Marquee>
                    <div className="info-panel-title-content">
                        <div className="info-panel-title-content-item">
                            <div className="info-panel-title-content-icon">
                                E
                            </div>
                            <div className="info-panel-title-content-text">{feature?.properties?.elev + ' ft'}</div>
                        </div>
                        <div className="info-panel-title-content-item">
                            <div className="info-panel-title-content-icon">
                                T
                            </div>
                            <div className="info-panel-title-content-text">{time}</div>
                        </div>
                    </div>
                </div>
            </div>
            {children}
            <Footer icao={icao} />
        </div>
    )
}