'use client'

import { useEffect, useState } from "react"
import { Map as oMap, MapBrowserEvent, View } from "ol"
import { fromLonLat, transformExtent } from "ol/proj"
import './Map.css'
import './components/Overlay.css'
import { mapStorage } from "@/storage/client/map"
import { onMessage } from "@/utils/ws"
import { updateFlightFeatures } from "./utils/flights"
import { WsMessage } from "@/types/misc"
import { handleClick, handleFlightPanelAction, handleHover } from "./utils/misc"
import { initData, initLayers } from "./utils/init"
import { usePathname, useRouter } from "next/navigation"
import BaseEvent from "ol/events/Event"
import { useSliderStore } from "@/storage/zustand/slider"
import { useFlightStore } from "@/storage/zustand/panel"
import { initTrack } from "./utils/track"
import { setAirportFeaturesByExtent, updateAirportFeatures } from "./utils/airports"
import NotFound from "./components/NotFound"
import { VatsimMinimalData } from "@/types/vatsim"

export default function Map({ }) {
    const router = useRouter()
    const pathname = usePathname()
    const { setPage } = useSliderStore()
    const { trackPoints, action } = useFlightStore()
    const [notFound, setNotFound] = useState<null | string[]>(null)

    useEffect(() => {
        // Init map
        const view = localStorage.getItem('MAP_VIEW')?.split(',')
        const zoom = view ? parseFloat(view[2]) : 3
        const center = view ? view.slice(0, 2).map(parseFloat) : [0, 0]
        const map = new oMap({
            target: "map",
            view: new View({
                center: fromLonLat(center),
                zoom: zoom,
                maxZoom: 18,
                minZoom: 3,
                extent: transformExtent([-190, -80, 190, 80], 'EPSG:4326', 'EPSG:3857')
            }),
            controls: []
        })
        mapStorage.map = map
        initLayers()

        // Init websocket updates
        const unMessage = onMessage((message: WsMessage) => {
            updateFlightFeatures(message.data as VatsimMinimalData)
            updateAirportFeatures(message.data as VatsimMinimalData)
        })

        // Init hover events
        const onPointerMove = (event: BaseEvent | Event) => {
            const targetEvent = event as MapBrowserEvent<UIEvent>
            handleHover(targetEvent)
        }
        map.on(['pointermove'], onPointerMove)

        // Init hover events
        const onMoveEnd = () => {
            setAirportFeaturesByExtent()
        }
        map.on(['moveend'], onMoveEnd)

        // Init flight feature animation
        // let animationFrameId: number
        // const animate = () => {
        //     animateFlightFeatures()
        //     animationFrameId = window.requestAnimationFrame(animate)
        // }
        // animationFrameId = window.requestAnimationFrame(animate)


        return () => {
            map.setTarget(undefined)
            map.un(['pointermove'], onPointerMove)
            map.un(['moveend'], onMoveEnd)
            unMessage()
            // if (animationFrameId) {
            //     window.cancelAnimationFrame(animationFrameId)
            // }
        }
    }, [])

    // Handle feature click events
    useEffect(() => {
        const map = mapStorage.map
        if (!map) return

        const onClick = (event: BaseEvent | Event) => {
            const targetEvent = event as MapBrowserEvent<UIEvent>
            mapStorage.animate = false

            setTimeout(() => {
                const route = handleClick(targetEvent)
                mapStorage.animate = true

                router.prefetch(route)
                setPage(route)
            }, 0)
        }

        map.on(['click'], onClick)

        return () => {
            map.un(['click'], onClick)
        }
    }, [router, setPage])

    // Handle path reset
    useEffect(() => {
        const handleNotFound = (found: boolean, path?: string) => {
            if (!found) {
                setPage('/')
                router.prefetch('/')

                if (path) {
                    setNotFound(path.split('/'))
                }
            }
        }

        initData(pathname, handleNotFound)
    }, [pathname, router, setPage])

    // Draw track when flight is loaded
    useEffect(() => {
        initTrack(trackPoints)
    }, [trackPoints])

    // Handle flight panel actions
    useEffect(() => {
        handleFlightPanelAction(action)
    }, [action])

    return (
        <>
            <div id="map" />
            {notFound && <NotFound path={notFound} close={() => setNotFound(null)} />}
        </>
    )
}