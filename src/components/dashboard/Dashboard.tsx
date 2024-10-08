'use client'

import useSWR from 'swr'
import Spinner from '../common/spinner/Spinner'
import './Dashboard.css'
import { fetcher } from '@/utils/api'
import { useRef, useState } from 'react'
import { PanelStates } from '@/types/misc'
import HistoryChart from './components/HistoryChart'
import { setHeight } from '@/utils/gui'
import GeneralStats from './components/GeneralStats'
import BusiestAirports from './components/BusiestAirports'
import RarestAirports from './components/RarestAirports'
import EventsList from './components/EventsList'

export default function Dashboard() {
    const { data, isLoading } = useSWR<null>('/api/data/dashboard', fetcher, {
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

    return (
        <div className='info-panel' ref={panelRef}>
            <Spinner show={isLoading} />
            <HistoryChart panelStates={panelStates} clickOpen={clickOpen} data={data} />
            <GeneralStats panelStates={panelStates} clickOpen={clickOpen} data={data} />
            <BusiestAirports panelStates={panelStates} clickOpen={clickOpen} data={data} />
            <RarestAirports panelStates={panelStates} clickOpen={clickOpen} data={data} />
            <EventsList panelStates={panelStates} clickOpen={clickOpen} data={data} />
        </div>
    )
}