import { MapStorage } from "@/types/map"
import { Feature, MapBrowserEvent } from "ol"
import { RefObject } from "react"
import { createFlightOverlay } from "./overlay"
import { Point } from "ol/geom"
import { webglConfig } from "./webgl"
import { initTrack } from "./track"
import { moveFlightFeatures } from "./flights"

export const handleHover = (mapRef: RefObject<MapStorage>, event: MapBrowserEvent<UIEvent>) => {
    if (!mapRef.current?.map) return

    const map = mapRef.current.map
    const overlays = mapRef.current.overlays
    const features = mapRef.current.features

    // if (!(event.originalEvent.target instanceof HTMLCanvasElement)) {
    //     map.getTargetElement().style.cursor = ''
    //     return
    // }

    const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature, {
        layerFilter: function (layer) {
            return layer.get('type') === 'airports' || layer.get('type') === 'airportTops' || layer.get('type') === 'flights' || layer.get('type') === 'firLabels'
        }
    }) as Feature<Point>

    if (feature === features.hover || feature === features.click) return

    if (overlays.hover) {
        const root = overlays.hover.get('root')
        root?.unmount()
        map.removeOverlay(overlays.hover)
        overlays.hover = null
    }

    const id = features.hover?.getId()

    if (features.hover?.get('type')?.includes('airport') && id) {
        const atcFeature = mapRef.current.sources.airports.getFeatureById(id)
        atcFeature?.set('hover', 0)
    }

    if (features.hover?.get('type') === 'fir' && id) {
        const polygon = mapRef.current.sources.firs.getFeatureById(id)
        polygon?.set('hover', 0)
    }

    if (features.hover?.get('type') === 'tracon' && id) {
        const polygon = mapRef.current.sources.tracons.getFeatureById(id)
        polygon?.set('hover', 0)
    }

    features.hover?.set('hover', 0)
    features.hover = null

    if (!feature) {
        map.getTargetElement().style.cursor = ''
        return
    }

    map.getTargetElement().style.cursor = 'pointer'

    feature.set('hover', 1)
    features.hover = feature

    if (feature?.get('type') === 'flight') {
        const overlay = createFlightOverlay(mapRef, feature as Feature<Point>, false)
        overlays.hover = overlay
    }

    // if (feature?.get('type')?.includes('airport')) {
    //     const atcFeature = vectorSourceRef.current.airportLabels.getFeatureById(feature.getId())
    //     popupRef.current.hover = PopupHandler.createAirportPopup(map, atcFeature ? atcFeature : feature, airportsRef)
    // }

    // if (feature?.get('type') === 'fir') {
    //     const polygon = vectorSourceRef.current.firs.getFeatureById(feature.getId())
    //     polygon.set('hover', 1)
    // }

    // if (feature?.get('type') === 'tracon') {
    //     const polygon = vectorSourceRef.current.tracons.getFeatureById(feature.getId())
    //     polygon.set('hover', 1)
    // }

    // if (feature?.get('type') === 'tracon' || feature?.get('type') === 'fir') {
    //     popupRef.current.hover = PopupHandler.createATCPopup(map, feature)
    // }
}

export function handleClick(mapRef: RefObject<MapStorage>, event: MapBrowserEvent<UIEvent>): string {
    if (!mapRef.current?.map) return '/'

    const map = mapRef.current.map
    const overlays = mapRef.current.overlays
    const features = mapRef.current.features

    const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature, {
        layerFilter: function (layer) {
            return layer.get('type') === 'airports' || layer.get('type') === 'airportTops' || layer.get('type') === 'flights' || layer.get('type') === 'firLabels'
        }
    }) as Feature<Point>

    resetMap(mapRef)

    if (!feature) {
        return '/'
    }

    feature.set('hover', 1)
    features.click = feature

    if (feature?.get('type') === 'flight') {
        const overlay = createFlightOverlay(mapRef, feature as Feature<Point>, true)
        overlays.click = overlay

        return '/flight/' + feature.get('callsign')
    }

    // if (feature?.get('type')?.includes('airport')) {
    //     const atcFeature = vectorSourceRef.current.airportLabels.getFeatureById(feature.getId())
    //     popupRef.current.click = PopupHandler.createAirportPopup(map, atcFeature ? atcFeature : feature, airportsRef)

    //     vectorSourceRef.current.airportTops.addFeature(feature)

    //     navigate(`/airport/${feature.get('icao')}`)
    // }

    // if (feature?.get('type') === 'tracon' || feature?.get('type') === 'fir') {
    //     popupRef.current.click = PopupHandler.createATCPopup(map, feature)

    //     // navigate(`/airport/${feature.get('icao')}`)
    // }

    return '/'
}

export function resetMap(mapRef: RefObject<MapStorage>) {
    if (!mapRef.current?.map) return

    mapRef.current.features.track = null
    mapRef.current.sources.tracks.clear()

    if (mapRef.current.view.lastView) {
        mapRef.current.map.getView().fit(mapRef.current.view.lastView, {
            duration: 200
        })

        webglConfig.flights.variables.callsign = 'all'
        webglConfig.shadows.variables.callsign = 'all'
        webglConfig.airports.variables.show = ''

        mapRef.current.view.lastView = null
    }

    mapRef.current.sources.airportTops.clear()

    if (mapRef.current.features.click?.get('type') === 'tracon') {
        const polygon = mapRef.current.sources.tracons.getFeatureById(mapRef.current.features.click.get('id'))
        polygon?.set('hover', 0)
    }

    if (mapRef.current.features.click?.get('type') === 'fir') {
        const polygon = mapRef.current.sources.firs.getFeatureById(mapRef.current.features.click.get('id'))
        polygon?.set('hover', 0)
    }

    if (mapRef.current.features.hover) {
        mapRef.current.features.hover.set('hover', 0)
        mapRef.current.features.hover = null
    }
    mapRef.current.features.click?.set('hover', 0)
    mapRef.current.features.click = null

    if (mapRef.current.overlays.hover) {
        const root = mapRef.current.overlays.hover.get('root')
        root?.unmount()
        mapRef.current.map.removeOverlay(mapRef.current.overlays.hover)
        mapRef.current.overlays.hover = null
    }
    if (mapRef.current.overlays.click) {
        const root = mapRef.current.overlays.click.get('root')
        root?.unmount()
        mapRef.current.map.removeOverlay(mapRef.current.overlays.click)
        mapRef.current.overlays.click = null
    }
}

export function handleFirstView(mapRef: RefObject<MapStorage>, path: string) {
    if (!mapRef.current) return

    if (path.includes('flight')) {
        setClickedFeature(mapRef, 'flight', path.split('/')[2])
        moveViewToFeature(mapRef, mapRef.current.features.click)
    }
    mapRef.current.view.viewInit = true
}

function setClickedFeature(mapRef: RefObject<MapStorage>, type: string, id: string | null) {
    if (!mapRef.current?.map || !id) return

    if (type === 'flight') {
        const features = mapRef.current.sources.flights.getFeatures() as Feature<Point>[]

        if (features.length > 0) {
            const feature = features.find(feature => feature.get('callsign') === id)

            if (!feature) {
                return
            }

            feature.set('hover', 1)
            mapRef.current.features.click = feature

            const overlay = createFlightOverlay(mapRef, feature as Feature<Point>, true)
            mapRef.current.overlays.click = overlay

            return
        }
    }
}

function moveViewToFeature(mapRef: RefObject<MapStorage>, feature: Feature | null) {
    if (!mapRef.current?.map || !feature) return

    const map = mapRef.current.map
    const view = map.getView()
    const extent = feature.getGeometry()?.getExtent()

    mapRef.current.view.lastView = view.calculateExtent(map.getSize())
    map.getView().animate({
        center: extent,
        zoom: 8,
        duration: 200
    })
}