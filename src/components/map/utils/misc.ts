import { Feature, MapBrowserEvent } from "ol"
import { createAirportOverlay, createFlightOverlay } from "./overlay"
import { Point } from "ol/geom"
import { webglConfig } from "./webgl"
import { followFlightFeature, setActiveFlightFeature, unFollowFlightFeature } from "./flights"
import { hideFlightRoute, setClickedAirportFeature, showFlightRoute } from "./airports"
import { intersects } from "ol/extent"
import { mapStorage } from "@/storage/singleton/map"

export const handleHover = (event: MapBrowserEvent<UIEvent>) => {
    if (!mapStorage.map) return

    const map = mapStorage.map
    const overlays = mapStorage.overlays
    const features = mapStorage.features

    if (!(event.originalEvent.target instanceof HTMLCanvasElement)) {
        map.getTargetElement().style.cursor = ''
        return
    }

    const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature, {
        layerFilter: function (layer) {
            return layer.get('type') === 'airports' || layer.get('type') === 'airportTops' || layer.get('type') === 'flights' || layer.get('type') === 'firLabels'
        }
    }) as Feature<Point>

    if (feature === features.hover || feature === features.click) {
        map.getTargetElement().style.cursor = 'pointer'
        return
    }

    if (overlays.hover) {
        const root = overlays.hover.get('root')
        root?.unmount()
        map.removeOverlay(overlays.hover)
        overlays.hover = null
    }

    const id = features.hover?.getId()

    if (features.hover?.get('type')?.includes('airport') && id) {
        const atcFeature = mapStorage.sources.airports.getFeatureById(id)
        atcFeature?.set('hover', 0)
    }

    if (features.hover?.get('type') === 'fir' && id) {
        const polygon = mapStorage.sources.firs.getFeatureById(id)
        polygon?.set('hover', 0)
    }

    if (features.hover?.get('type') === 'tracon' && id) {
        const polygon = mapStorage.sources.tracons.getFeatureById(id)
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
        const overlay = createFlightOverlay(feature as Feature<Point>, false)
        overlays.hover = overlay
    }

    if (feature?.get('type')?.includes('airport')) {
        const overlay = createAirportOverlay(feature as Feature<Point>, false)
        overlays.hover = overlay
    }

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

export function handleClick(event: MapBrowserEvent<UIEvent>): string {
    if (!mapStorage.map) return '/'

    const map = mapStorage.map
    const overlays = mapStorage.overlays
    const features = mapStorage.features

    const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature, {
        layerFilter: function (layer) {
            return layer.get('type') === 'airports' || layer.get('type') === 'airportTops' || layer.get('type') === 'flights' || layer.get('type') === 'firLabels'
        }
    }) as Feature<Point>

    if (!feature) {
        return '/'
    }

    resetMap()

    feature.set('hover', 1)
    features.click = feature

    if (feature?.get('type') === 'flight') {
        const overlay = createFlightOverlay(feature as Feature<Point>, true)
        overlays.click = overlay

        return '/flight/' + feature.get('callsign')
    }

    if (feature?.get('type')?.includes('airport')) {
        const overlay = createAirportOverlay(feature as Feature<Point>, true)
        overlays.click = overlay

        setClickedAirportFeature(feature.get('icao'), feature)

        return '/airport/' + feature.get('icao')
    }

    // if (feature?.get('type') === 'tracon' || feature?.get('type') === 'fir') {
    //     popupRef.current.click = PopupHandler.createATCPopup(map, feature)

    //     // navigate(`/airport/${feature.get('icao')}`)
    // }

    return '/'
}

export function resetMap() {
    if (!mapStorage.map) return

    mapStorage.features.track = null
    mapStorage.sources.tracks.clear()

    if (mapStorage.view.lastView) {
        mapStorage.map.getView().fit(mapStorage.view.lastView, {
            duration: 200
        })

        webglConfig.flights.variables.callsign = 'all'
        webglConfig.shadows.variables.callsign = 'all'
        webglConfig.airports.variables.show = ''

        mapStorage.view.lastView = null
    }

    mapStorage.sources.airportTops.clear()

    if (mapStorage.features.click?.get('type') === 'tracon') {
        const polygon = mapStorage.sources.tracons.getFeatureById(mapStorage.features.click.get('id'))
        polygon?.set('hover', 0)
    }

    if (mapStorage.features.click?.get('type') === 'fir') {
        const polygon = mapStorage.sources.firs.getFeatureById(mapStorage.features.click.get('id'))
        polygon?.set('hover', 0)
    }

    if (mapStorage.features.hover) {
        mapStorage.features.hover.set('hover', 0)
        mapStorage.features.hover = null
    }
    mapStorage.features.click?.set('hover', 0)
    mapStorage.features.click = null

    if (mapStorage.overlays.hover) {
        const root = mapStorage.overlays.hover.get('root')
        setTimeout(() => {
            root?.unmount()
        }, 0)

        mapStorage.map.removeOverlay(mapStorage.overlays.hover)
        mapStorage.overlays.hover = null
    }
    if (mapStorage.overlays.click) {
        const root = mapStorage.overlays.click.get('root')
        setTimeout(() => {
            root?.unmount()
        }, 0)

        mapStorage.map.removeOverlay(mapStorage.overlays.click)
        mapStorage.overlays.click = null
    }
}

export async function handlePathChange(path: string, handleNotFound: (found: boolean, path?: string) => void) {
    if ((path === '/' && mapStorage.view.viewInit)) {
        resetMap()
        return
    }

    if (path.includes('flight') && mapStorage.features.click?.get('type') !== 'flight') {
        const found = setActiveFlightFeature(path.split('/')[2])
        moveViewToFeature(mapStorage.features.click, 8)

        handleNotFound(found, path)
        return
    }
    if (path.includes('airport') && !mapStorage.features.click?.get('type')?.includes('airport')) {
        const found = await setClickedAirportFeature(path.split('/')[2], null)
        moveViewToFeature(mapStorage.features.click, 13)

        handleNotFound(found, path)
        return
    }

    if (!path.includes('flight') && !path.includes('airport')) {
        handleNotFound(false)
    }
}

export function moveViewToFeature(feature: Feature | null, zoom?: number) {
    if (!mapStorage.map || !feature) return

    const map = mapStorage.map
    const view = map.getView()
    if (!zoom) { zoom = view.getZoom() }

    const featureExtent = feature.getGeometry()?.getExtent()
    const viewExtent = view.calculateExtent(map.getSize())

    if (!featureExtent || intersects(viewExtent, featureExtent)) return

    view.animate({
        center: featureExtent,
        zoom: zoom,
        duration: 200
    })
}

let prevAction: null | string | number = null
export function handleFlightPanelAction(action: number | string | null) {
    const map = mapStorage.map
    if (!map) return

    if (!action) {
        unFollowFlightFeature()
        if (prevAction === 1) { hideFlightRoute() }

        if (mapStorage.view.lastView) {
            map.getView().fit(mapStorage.view.lastView, {
                duration: 200
            })
        }
        mapStorage.view.lastView = null

        if (mapStorage.features.hover) {
            mapStorage.features.hover.set('hover', 0)
            mapStorage.features.hover = null
        }

        if (mapStorage.overlays.hover) {
            const root = mapStorage.overlays.hover.get('root')
            setTimeout(() => {
                root?.unmount()
            }, 0)

            mapStorage.map?.removeOverlay(mapStorage.overlays.hover)
            mapStorage.overlays.hover = null
        }
    }

    if (action === 1) {
        showFlightRoute()
    }

    if (action === 2) {
        followFlightFeature()
    }

    if (typeof action === 'string') {
        setActiveFlightFeature(action, 'hover')
    }

    prevAction = action
}