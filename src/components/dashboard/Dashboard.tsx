'use client'

import useSWR from 'swr'
import Spinner from '../common/spinner/Spinner'
import './Dashboard.css'
import { fetcher } from '@/utils/api/api'
import { useRef, useState } from 'react'
import { PanelStates } from '@/types/panel'
import Dropdown from '../common/panel/Dropdown'
import Chart from '../common/chart/Chart'

export default function Dashboard() {
    const { isLoading } = useSWR<null>('/api/data/dashboard', fetcher, {
        refreshInterval: 60000,
        revalidateOnFocus: false
    })
    const [panelStates, setPanelStates] = useState<PanelStates>({
        chart: false,
        stats: false,
        busiest: false,
        rarest: false,
        events: false
    })
    const panelRef = useRef<HTMLDivElement>(null)

    const openDropdown = (item: keyof typeof panelStates) => {
        setPanelStates((prevState) => ({
            ...prevState,
            [item]: !panelStates[item]
        }))
    }

    if (isLoading) return (
        <div className='info-panel loading'>
            <Spinner show={true} />
        </div>
    )

    return (
        <div className='info-panel' ref={panelRef}>
            <div className="info-panel-container column dashboard scrollable">
                <Dropdown open={panelStates.chart} minHeight={32} className='column main'>
                    <button className='info-panel-container-header' onClick={() => openDropdown('chart')}>
                        <p>Last 24 hours</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.chart ? 'open' : ''}`}>
                            <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                    <div className="info-panel-container-content">
                        <Chart param={null} />
                    </div>
                </Dropdown>
                <Dropdown open={panelStates.stats} minHeight={32} className='column main'>
                    <button className='info-panel-container-header' onClick={() => openDropdown('stats')}>
                        <p>General statistics</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.stats ? 'open' : ''}`}>
                            <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                    <div className="info-panel-container-content">
                        ...
                    </div>
                </Dropdown>
                <Dropdown open={panelStates.busiest} minHeight={32} className='column main'>
                    <button className='info-panel-container-header' onClick={() => openDropdown('busiest')}>
                        <p>Busiest airports</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.busiest ? 'open' : ''}`}>
                            <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                    <div className="info-panel-container-content">
                        ...
                    </div>
                </Dropdown>
                <Dropdown open={panelStates.rarest} minHeight={32} className='column main'>
                    <button className='info-panel-container-header' onClick={() => openDropdown('rarest')}>
                        <p>Rare controller connections</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.rarest ? 'open' : ''}`}>
                            <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                    <div className="info-panel-container-content">
                        ...
                    </div>
                </Dropdown>
                <Dropdown open={panelStates.events} minHeight={32} className='column main'>
                    <button className='info-panel-container-header' onClick={() => openDropdown('events')}>
                        <p>VATSIM events</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.events ? 'open' : ''}`}>
                            <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                    <div className="info-panel-container-content">
                        ...
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}