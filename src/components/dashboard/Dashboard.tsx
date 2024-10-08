'use client'

import useSWR from 'swr'
import Spinner from '../common/spinner/Spinner'
import './Dashboard.css'
import { fetcher } from '@/utils/api'
import { useRef, useState } from 'react'
import { PanelStates } from '@/types/misc'
import HistoryChart from './components/HistoryChart'
import GeneralStats from './components/GeneralStats'
import BusiestAirports from './components/BusiestAirports'
import RarestAirports from './components/RarestAirports'
import EventsList from './components/EventsList'

export default function Dashboard() {
    const { isLoading } = useSWR<null>('/api/data/dashboard', fetcher, {
        refreshInterval: 60000,
        revalidateOnFocus: false
    })
    const [panelStates] = useState<PanelStates>({
        chart: false,
        stats: false,
        busiest: false,
        rarest: false,
        events: false
    })
    const panelRef = useRef<HTMLDivElement>(null)

    const clickOpen = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement
        const name = target.dataset.name

        if (!name || !(name in panelStates)) return

        // setHeight(e, panelStates[name])
        // // const prevState = handleCollapse(e.target.parentElement, { ...panelStates }, panelStates.chart)
        // setPanelStates({
        //     ...prevState,
        //     chart: !prevState.chart
        // })
    }

    if (isLoading) return (
        <div className='info-panel loading'>
            <Spinner show={true} />
        </div>
    )

    return (
        <div className='info-panel' ref={panelRef}>
            <HistoryChart panelStates={panelStates} clickOpen={clickOpen} />
            <GeneralStats panelStates={panelStates} clickOpen={clickOpen} />
            <BusiestAirports panelStates={panelStates} clickOpen={clickOpen} />
            <RarestAirports panelStates={panelStates} clickOpen={clickOpen} />
            <EventsList panelStates={panelStates} clickOpen={clickOpen} />
        </div>
    )
}