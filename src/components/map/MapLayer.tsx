'use client'

import { useEffect, useRef } from "react"
import { Map, View } from "ol"
import { fromLonLat, transformExtent } from "ol/proj"
import { MapLibreLayer } from "@geoblocks/ol-maplibre-layer"
import mapLibreStyle from '@/assets/styles/positron.json'
import { StyleSpecification } from "maplibre-gl"
import VectorSource from "ol/source/Vector"
import './Map.css'
import { webglConfig, WebGLLayer } from "./webgl"
import { VectorStyle } from "ol/render/webgl/VectorStyleRenderer"
import { updateSunFeatures } from './utils/dayNight'
import { MapStorage } from "@/types/map"
import VectorLayer from "ol/layer/Vector"
import WebGLPointsLayer from "ol/layer/WebGLPoints"
import { FeatureLike } from "ol/Feature"
import { getFIRStyle } from "./utils/style"
import { StyleLike } from "ol/style/Style"
import { VatsimDataStorage } from "@/types/data/vatsim"
import { initMapStorage } from "@/storage/map"

export default function MapLayer({ vatsimData }: { vatsimData: VatsimDataStorage }) {
    const mapRef = useRef<MapStorage>(initMapStorage(vatsimData))

    useEffect(() => {
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

        const mbLayer = new MapLibreLayer({
            mapLibreOptions: {
                style: mapLibreStyle as StyleSpecification,
            },
            properties: { type: 'base' }
        })
        map.addLayer(mbLayer)

        const sunLayer = new WebGLLayer({
            source: new VectorSource({
                wrapX: false
            }),
            style: webglConfig.sun as VectorStyle,
            properties: { type: 'sun' }
        })
        map.addLayer(sunLayer)

        const firLayer = new WebGLLayer({
            source: mapRef.current.sources.firs,
            style: webglConfig.firs,
            properties: { type: 'firs' }
        })
        firLayer.setZIndex(1)
        map.addLayer(firLayer)

        const traconLayer = new WebGLLayer({
            source: mapRef.current.sources.tracons,
            style: webglConfig.firs,
            properties: { type: 'tracons' }
        })
        traconLayer.setZIndex(2)
        map.addLayer(traconLayer)

        const routeLayer = new VectorLayer({
            source: mapRef.current.sources.routes,
            properties: { type: 'routes' }
        })
        routeLayer.setZIndex(3)
        map.addLayer(routeLayer)

        const shadowLayer = new WebGLPointsLayer({
            source: mapRef.current.sources.flights as VectorSource<FeatureLike>,
            style: webglConfig.shadows,
            properties: { type: 'shadows' }
        })
        shadowLayer.setZIndex(4)
        map.addLayer(shadowLayer)

        const flightLayer = new WebGLPointsLayer({
            source: mapRef.current.sources.flights as VectorSource<FeatureLike>,
            style: webglConfig.flights,
            properties: { type: 'flights' }
        })
        flightLayer.setZIndex(5)
        map.addLayer(flightLayer)

        const airportLabelLayer = new WebGLPointsLayer({
            source: mapRef.current.sources.airportLabels as VectorSource<FeatureLike>,
            style: webglConfig.airportLabels,
            properties: { type: 'airportLabels' }
        })
        airportLabelLayer.setZIndex(6)
        map.addLayer(airportLabelLayer)

        const airportLayer = new WebGLPointsLayer({
            source: mapRef.current.sources.airports as VectorSource<FeatureLike>,
            style: webglConfig.airports,
            properties: { type: 'airports' }
        })
        airportLayer.setZIndex(7)
        map.addLayer(airportLayer)

        const airportTopLayer = new WebGLPointsLayer({
            source: mapRef.current.sources.airportTops as VectorSource<FeatureLike>,
            style: webglConfig.airportTops,
            properties: { type: 'airportTops' }
        })
        airportTopLayer.setZIndex(8)
        map.addLayer(airportTopLayer)

        const firLabelLayer = new VectorLayer({
            source: mapRef.current.sources.firLabels,
            style: getFIRStyle as StyleLike,
            properties: { type: 'firLabels' }
        })
        firLabelLayer.setZIndex(9)
        map.addLayer(firLabelLayer)

        const updateSunLayer = () => {
            updateSunFeatures(sunLayer.getSource() as VectorSource)
        }
        updateSunLayer()
        const sunLayerInterval = setInterval(updateSunLayer, 5000)

        // const animate = () => {
        //     map.render()
        //     animationFrameId = window.requestAnimationFrame(animate)
        // }
        // let animationFrameId = window.requestAnimationFrame(animate)

        return () => {
            map.setTarget('')
            // if (animationFrameId) {
            //     window.cancelAnimationFrame(animationFrameId)
            // }
            clearInterval(sunLayerInterval)
        }
    }, [])

    return (
        <div id="map" />
    )
}