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
import { updateSunFeatures } from './utils/mapSun'
import { VectorSources } from "@/types/map"
import VectorLayer from "ol/layer/Vector"
import WebGLPointsLayer from "ol/layer/WebGLPoints"
import { FeatureLike } from "ol/Feature"
import { getFIRStyle } from "./utils/mapStyle"
import { StyleLike } from "ol/style/Style"

export default function MapLayer() {
    const mapRef = useRef<Map | null>(null)
    const vectorSourceRef = useRef<VectorSources>({
        firs: new VectorSource(),
        tracons: new VectorSource(),
        firLabels: new VectorSource(),
        airportLabels: new VectorSource(),
        airports: new VectorSource(),
        routes: new VectorSource(),
        flights: new VectorSource(),
        airportTops: new VectorSource()
    })

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
        mapRef.current = map

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
            source: vectorSourceRef.current.firs,
            style: webglConfig.firs,
            properties: { type: 'firs' }
        })
        firLayer.setZIndex(1)
        map.addLayer(firLayer)

        const traconLayer = new WebGLLayer({
            source: vectorSourceRef.current.tracons,
            style: webglConfig.firs,
            properties: { type: 'tracons' }
        })
        traconLayer.setZIndex(2)
        map.addLayer(traconLayer)

        const routeLayer = new VectorLayer({
            source: vectorSourceRef.current.routes,
            properties: { type: 'routes' }
        })
        routeLayer.setZIndex(3)
        map.addLayer(routeLayer)

        const shadowLayer = new WebGLPointsLayer({
            source: vectorSourceRef.current.flights as VectorSource<FeatureLike>,
            style: webglConfig.shadows,
            properties: { type: 'shadows' }
        })
        shadowLayer.setZIndex(4)
        map.addLayer(shadowLayer)

        const flightLayer = new WebGLPointsLayer({
            source: vectorSourceRef.current.flights as VectorSource<FeatureLike>,
            style: webglConfig.flights,
            properties: { type: 'flights' }
        })
        flightLayer.setZIndex(5)
        map.addLayer(flightLayer)

        const airportLabelLayer = new WebGLPointsLayer({
            source: vectorSourceRef.current.airportLabels as VectorSource<FeatureLike>,
            style: webglConfig.airportLabels,
            properties: { type: 'airportLabels' }
        })
        airportLabelLayer.setZIndex(6)
        map.addLayer(airportLabelLayer)

        const airportLayer = new WebGLPointsLayer({
            source: vectorSourceRef.current.airports as VectorSource<FeatureLike>,
            style: webglConfig.airports,
            properties: { type: 'airports' }
        })
        airportLayer.setZIndex(7)
        map.addLayer(airportLayer)

        const airportTopLayer = new WebGLPointsLayer({
            source: vectorSourceRef.current.airportTops as VectorSource<FeatureLike>,
            style: webglConfig.airportTops,
            properties: { type: 'airportTops' }
        })
        airportTopLayer.setZIndex(8)
        map.addLayer(airportTopLayer)

        const firLabelLayer = new VectorLayer({
            source: vectorSourceRef.current.firLabels,
            style: getFIRStyle as StyleLike,
            properties: { type: 'firLabels' }
        })
        firLabelLayer.setZIndex(9)
        map.addLayer(firLabelLayer)

        // vectorSourceRef.current.init = Date.now()

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