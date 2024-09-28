'use client'

import { useEffect, useRef } from "react"
import { Map, MapBrowserEvent, View } from "ol"
import { fromLonLat, transformExtent } from "ol/proj"
import './Map.css'
import { MapStorage } from "@/types/map"
import { mapStorage } from "@/storage/singletons/map"
import { onMessage } from "@/utils/ws"
import { moveFlightFeatures, updateFlightFeatures } from "./utils/flights"
import { WsMessage } from "@/types/misc"
import { VatsimDataWS } from "@/types/vatsim"
import { handleClick, handleHover, setClickedFeature } from "./utils/misc"
import { initLayers } from "./utils/init"
import { usePathname, useRouter } from "next/navigation"
import BaseEvent from "ol/events/Event"
import { fetchTrack, initTrack } from "./utils/track"
import useSWR from "swr"
import { fetcher } from "@/utils/api"

export default function MapLayer({ }) {
    const router = useRouter()
    const pathname = usePathname()
    const { data } = useSWR<VatsimDataWS | null>('/api/data/init', fetcher)
    const mapRef = useRef<MapStorage>(mapStorage)

    useEffect(() => {
        const unMessage = onMessage((message: WsMessage) => {
            updateFlightFeatures(mapRef, message.data as VatsimDataWS)
        })
        const onHover = (event: BaseEvent | Event) => {
            const targetEvent = event as MapBrowserEvent<UIEvent>
            handleHover(mapRef, targetEvent)
        }

        let animationFrameId: number
        let then: number = Date.now()
        const fpsInterval = 1000 / 30
        const limit = true

        const animate = () => {
            const now = Date.now()
            const elapsed = now - then

            if (elapsed > fpsInterval || !limit) {
                if (mapRef.current.animate) moveFlightFeatures(mapRef)
                map.render()

                then = now - (elapsed % fpsInterval)
            }
            animationFrameId = window.requestAnimationFrame(animate)
        }

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
        animationFrameId = window.requestAnimationFrame(animate)

        map.on(['pointermove'], onHover)

        return () => {
            map.setTarget('')
            map.un(['pointermove'], onHover)
            unMessage()
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId)
            }
        }
    }, [])

    useEffect(() => {
        if (data) updateFlightFeatures(mapRef, data)
    }, [data])

    useEffect(() => {
        if (!mapRef.current.view.viewInit) {
            if (pathname.includes('flight')) {
                setClickedFeature(mapRef, 'flight', pathname.split('/')[2])
            }
            mapRef.current.view.viewInit = true
        }
    }, [pathname])

    useEffect(() => {
        const map = mapRef.current.map
        if (!map) return

        const onClick = async (event: BaseEvent | Event) => {
            const targetEvent = event as MapBrowserEvent<UIEvent>
            mapRef.current.animate = false

            setTimeout(async () => {
                const route = handleClick(mapRef, targetEvent)

                mapRef.current.animate = true
                router.replace(route)

                if (route.split('/').length > 2) {
                    const response = await fetch(`/api/data${route}`)
                    if (!response.ok) {
                        console.error('Error fetching track data for flight ' + route.split('/')[1])
                        return null
                    }

                    console.log(await response.json())
                }

                const trackData = await fetchTrack(route)
                initTrack(mapRef, trackData?.points)
            }, 0)
        }

        map.on(['click'], onClick)

        return () => {
            map.un(['click'], onClick)
        }
    }, [router])

    return (
        <div id="map" />
    )
}