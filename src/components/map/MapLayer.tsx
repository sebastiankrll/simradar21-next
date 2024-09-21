'use client'

import { useEffect, useRef } from "react"
import { Map, MapBrowserEvent, View } from "ol"
import { fromLonLat, transformExtent } from "ol/proj"
import './Map.css'
import { MapStorage } from "@/types/map"
import { mapStorage } from "@/storage/map"
import { onMessage } from "@/utils/ws"
import { moveFlightFeatures, updateFlightFeatures } from "./utils/flights"
import { WsMessage } from "@/types/misc"
import { VatsimDataWS } from "@/types/vatsim"
import { handleClick, handleHover } from "./utils/misc"
import { initLayers } from "./utils/init"
import { useRouter } from "next/navigation"
import BaseEvent from "ol/events/Event"

export default function MapLayer({ }) {
    const router = useRouter()
    const mapRef = useRef<MapStorage>(mapStorage)
    const animateRef = useRef(false)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/data/init')
            const data = await res.json()
            updateFlightFeatures(mapRef, data.data as VatsimDataWS | null)
        }
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
                if (!animateRef.current) moveFlightFeatures(mapRef)
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
        fetchData()
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
        const map = mapRef.current.map
        if (!map) return

        const onClick = (event: BaseEvent | Event) => {
            const targetEvent = event as MapBrowserEvent<UIEvent>
            animateRef.current = true
            setTimeout(() => {
                const route = handleClick(mapRef, targetEvent)
                animateRef.current = false
                router.push(route)
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