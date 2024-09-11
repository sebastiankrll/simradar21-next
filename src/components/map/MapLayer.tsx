'use client'

import { useEffect, useRef } from "react"
import { Map, View } from "ol"
import { fromLonLat, transformExtent } from "ol/proj"
import { MapLibreLayer } from "@geoblocks/ol-maplibre-layer"
import mapLibreStyle from '@/assets/styles/positron.json'

import './Map.css'
import { StyleSpecification } from "maplibre-gl"

export default function MapLayer() {
    const mapRef = useRef<Map | null>(null)

    useEffect(() => {
        const mbLayer = new MapLibreLayer({
            mapLibreOptions: {
                style: mapLibreStyle as StyleSpecification,
            },
        })

        // const sunLayer = new WebGLLayer({
        //     source: vectorSourceRef.current.sun,
        //     style: webglConfig.sun
        // })

        // const firLayer = new WebGLLayer({
        //     source: vectorSourceRef.current.firs,
        //     style: webglConfig.firs,
        //     type: 'firs'
        // })
        // firLayer.setZIndex(1)

        // const traconLayer = new WebGLLayer({
        //     source: vectorSourceRef.current.tracons,
        //     style: webglConfig.firs,
        //     type: 'tracons'
        // })
        // traconLayer.setZIndex(2)

        // const routeLayer = new VectorLayer({
        //     source: vectorSourceRef.current.routes,
        // })
        // routeLayer.setZIndex(3)

        // const shadowLayer = new WebGLPointsLayer({
        //     source: vectorSourceRef.current.flights,
        //     style: webglConfig.shadows
        // })
        // shadowLayer.setZIndex(4)

        // const flightLayer = new WebGLPointsLayer({
        //     source: vectorSourceRef.current.flights,
        //     style: webglConfig.flights,
        //     type: 'flights',
        //     initTime: Date.now()
        // })
        // flightLayer.setZIndex(5)

        // const airportLabelLayer = new WebGLPointsLayer({
        //     source: vectorSourceRef.current.airportLabels,
        //     style: webglConfig.airportLabels,
        //     type: 'airportLabels'
        // })
        // airportLabelLayer.setZIndex(6)

        // const airportLayer = new WebGLPointsLayer({
        //     source: vectorSourceRef.current.airports,
        //     style: webglConfig.airports,
        //     type: 'airports'
        // })
        // airportLayer.setZIndex(7)

        // const airportTopLayer = new WebGLPointsLayer({
        //     source: vectorSourceRef.current.airportTops,
        //     style: webglConfig.airportTops,
        //     type: 'airportTops'
        // })
        // airportTopLayer.setZIndex(8)

        // const firLabelLayer = new VectorLayer({
        //     source: vectorSourceRef.current.firLabels,
        //     style: StyleHandler.getFIRStyle,
        //     type: 'firLabels'
        // })
        // firLabelLayer.setZIndex(9)

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
        map.addLayer(mbLayer)
        mapRef.current = map

        // vectorSourceRef.current.init = Date.now()

        // const updateSunLayer = () => {
        //     addSunFeatures(vectorSourceRef)
        // }
        // updateSunLayer()
        // const sunLayerInterval = setInterval(updateSunLayer, 30000)

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
            // clearInterval(sunLayerInterval)
        }
    }, [])

    return (
        <div id="map" />
    )
}