'use client'

import { useEffect, useRef } from "react"
import { Map, MapBrowserEvent, View } from "ol"
import { fromLonLat, transformExtent } from "ol/proj"
import './Map.css'
import { MapStorage } from "@/types/map"
import { VatsimDataStorage } from "@/types/vatsim"
import { initMapStorage } from "@/storage/map"
import { onMessage } from "@/utils/ws"
import { moveFlightFeatures, updateFlightFeatures } from "./utils/flights"
import { WsMessage } from "@/types/misc"
import { VatsimDataWS } from "@/types/vatsim"
import { handleClick, handleHover } from "./utils/misc"
import { initLayers } from "./utils/init"

export default function MapLayer({ vatsimData }: { vatsimData: VatsimDataStorage }) {
    const mapRef = useRef<MapStorage>(initMapStorage(vatsimData))

    useEffect(() => {
        const unMessage = onMessage((message: WsMessage) => {
            updateFlightFeatures(mapRef, message.data as VatsimDataWS)
        })
        const onHover = (event: MapBrowserEvent<any>) => {
            handleHover(mapRef, event)
        }
        const onClick = (event: MapBrowserEvent<any>) => {
            handleClick(mapRef, event)
        }
        const animate = () => {
            map.render()
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

        let animationFrameId = window.requestAnimationFrame(animate)
        initLayers(mapRef)
        moveFlightFeatures(mapRef)

        map.on(['pointermove'], onHover as (event: any) => unknown)
        map.on(['click'], onClick as (event: any) => unknown)

        return () => {
            map.setTarget('')
            map.un(['pointermove'], onHover as (event: any) => unknown)
            map.un(['click'], onClick as (event: any) => unknown)
            unMessage()
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId)
            }
        }
    }, [])

    return (
        <div id="map" />
    )
}