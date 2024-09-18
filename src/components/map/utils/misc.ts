import { MapStorage } from "@/types/map"
import { Feature, MapBrowserEvent } from "ol"
import { RefObject } from "react"
import { createFlightOverlay } from "./overlays"
import { Point } from "ol/geom"
import { webglConfig } from "./webgl"

export const handleHover = (mapRef: RefObject<MapStorage>, event: MapBrowserEvent<any>) => {
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
    }) as Feature

    if (feature === features.hover || feature === features.click) return

    if (overlays.hover) map.removeOverlay(overlays.hover)
    overlays.hover = null

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
        const overlay = createFlightOverlay(mapRef, feature as Feature<Point>)
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

export function handleClick(mapRef: RefObject<MapStorage>, event: MapBrowserEvent<any>) {
    if (!mapRef.current?.map) return

    const map = mapRef.current.map
    const overlays = mapRef.current.overlays
    const features = mapRef.current.features

    const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature, {
        layerFilter: function (layer) {
            return layer.get('type') === 'airports' || layer.get('type') === 'airportTops' || layer.get('type') === 'flights' || layer.get('type') === 'firLabels'
        }
    }) as Feature

    if (!feature) {
        resetMap(mapRef, true)
        return
    }

    if (overlays.hover && features.hover) {
        resetMap(mapRef, false)

        overlays.click = overlays.hover
        overlays.hover = null
        features.click = features.hover
        features.hover = null

        return
    } else {
        resetMap(mapRef, true)
    }

    feature.set('hover', 1)
    features.click = feature

    if (feature?.get('type') === 'flight') {
        const overlay = createFlightOverlay(mapRef, feature as Feature<Point>)
        overlays.click = overlay
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
}

export function resetMap(mapRef: RefObject<MapStorage>, fullReset: boolean) {
    if (!mapRef.current?.map) return

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
    mapRef.current.sources.routes.clear()

    if (mapRef.current.features.click?.get('type') === 'tracon' && fullReset) {
        const polygon = mapRef.current.sources.tracons.getFeatureById(mapRef.current.features.click.get('id'))
        polygon?.set('hover', 0)
    }

    if (mapRef.current.features.click?.get('type') === 'fir' && fullReset) {
        const polygon = mapRef.current.sources.firs.getFeatureById(mapRef.current.features.click.get('id'))
        polygon?.set('hover', 0)
    }

    mapRef.current.features.route = null

    if (mapRef.current.features.hover && fullReset) {
        mapRef.current.features.hover.set('hover', 0)
        mapRef.current.features.hover = null
    }
    mapRef.current.features.click?.set('hover', 0)
    mapRef.current.features.click = null

    if (mapRef.current.overlays.hover && fullReset) {
        mapRef.current.map.removeOverlay(mapRef.current.overlays.hover)
        mapRef.current.overlays.hover = null
    }
    if (mapRef.current.overlays.click) mapRef.current.map.removeOverlay(mapRef.current.overlays.click)
    mapRef.current.overlays.click = null
}