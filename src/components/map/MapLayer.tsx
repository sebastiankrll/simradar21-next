'use client'

import { useEffect, useRef } from "react"
import { Map, MapBrowserEvent, View } from "ol"
import { fromLonLat, transformExtent } from "ol/proj"
import './Map.css'
import { MapStorage } from "@/types/map"
import { mapStorage } from "@/storage/singletons/map"
import { onMessage } from "@/utils/ws"
import { animateFeatures, updateFlightFeatures } from "./utils/flights"
import { WsMessage } from "@/types/misc"
import { VatsimDataWS } from "@/types/vatsim"
import { handleClick, handleHover, setClickedFeature } from "./utils/misc"
import { initLayers } from "./utils/init"
import { usePathname, useRouter } from "next/navigation"
import BaseEvent from "ol/events/Event"
import useSWR from "swr"
import { fetcher } from "@/utils/api"
import { useSliderStore } from "@/storage/zustand/slider"
import { useFlightStore } from "@/storage/zustand/flight"
import { initTrack } from "./utils/track"

export default function MapLayer({ }) {
    const router = useRouter()
    const pathname = usePathname()
    const { data } = useSWR<VatsimDataWS | null>('/api/data/init', fetcher, {
        revalidateOnFocus: false
    })
    const { setPage } = useSliderStore()
    const { trackPoints } = useFlightStore()

    const mapRef = useRef<MapStorage>(mapStorage)

    useEffect(() => {
        // Init map
        const view = localStorage.getItem('MAP_VIEW')?.split(',')
        const zoom = view ? parseFloat(view[2]) : 3
        const center = view ? view.slice(0, 2).map(parseFloat) : [0, 0]
        const map = new Map({
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
        mapRef.current.map = map
        initLayers(mapRef)

        // Init websocket updates
        const unMessage = onMessage((message: WsMessage) => {
            updateFlightFeatures(mapRef, message.data as VatsimDataWS)
        })

        // Init hover events
        const onHover = (event: BaseEvent | Event) => {
            const targetEvent = event as MapBrowserEvent<UIEvent>
            handleHover(mapRef, targetEvent)
        }
        map.on(['pointermove'], onHover)

        // Init flight feature animation
        let animationFrameId: number
        const animate = () => {
            animateFeatures(mapRef)
            animationFrameId = window.requestAnimationFrame(animate)
        }
        animationFrameId = window.requestAnimationFrame(animate)


        return () => {
            map.setTarget('')
            map.un(['pointermove'], onHover)
            unMessage()
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId)
            }
        }
    }, [])

    // Init features once on page load via API
    useEffect(() => {
        if (data) updateFlightFeatures(mapRef, data)
    }, [data])

    // Draw track when flight is loaded
    useEffect(() => {
        initTrack(mapRef, trackPoints)
    }, [trackPoints])

    // Set flight feature on page reload with active flight route
    useEffect(() => {
        if (!mapRef.current.view.viewInit) {
            if (pathname.includes('flight')) {
                setClickedFeature(mapRef, 'flight', pathname.split('/')[2])
            }
            mapRef.current.view.viewInit = true
        }
    }, [pathname])

    // Handle feature click events
    useEffect(() => {
        const map = mapRef.current.map
        if (!map) return

        const onClick = (event: BaseEvent | Event) => {
            const targetEvent = event as MapBrowserEvent<UIEvent>
            mapRef.current.animate = false

            setTimeout(() => {
                const route = handleClick(mapRef, targetEvent)
                mapRef.current.animate = true

                router.prefetch(route)
                setPage(route)
            }, 0)
        }

        map.on(['click'], onClick)

        return () => {
            map.un(['click'], onClick)
        }
    }, [router, setPage])

    return (
        <div id="map" />
    )
}