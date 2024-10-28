import { Attitude, MapStorage } from "@/types/map"
import { Feature, Overlay } from "ol"
import { RefObject } from "react"
import { createRoot } from "react-dom/client"
import { AirportOverlay, FlightOverlay } from "../components/overlays"
import { Point } from "ol/geom"
import { LiveFlightData } from "@/types/panel"
import { roundNumToX } from "@/utils/common"

export function createFlightOverlay(mapRef: RefObject<MapStorage>, feature: Feature<Point>, click: boolean): Overlay | null {
    if (!mapRef.current?.map) return null

    const element = document.createElement('div')
    const root = createRoot(element)
    root.render(<FlightOverlay feature={feature} click={click} />)

    const overlay = new Overlay({
        element,
        position: feature.getGeometry()?.getCoordinates(),
        positioning: 'bottom-center',
        offset: [0, -25],
        id: feature.get('callsign')
    })
    overlay.set('root', root)
    mapRef.current?.map.addOverlay(overlay)

    return overlay
}

export function moveFlightOverlay(mapRef: RefObject<MapStorage>) {
    const overlays = mapRef.current?.overlays
    const features = mapRef.current?.features

    if (overlays?.hover && features?.hover) {
        const feature = features.hover as Feature<Point>
        overlays.hover.setPosition(feature.getGeometry()?.getCoordinates())
    }

    if (overlays?.click && features?.click) {
        const feature = features.click as Feature<Point>
        overlays.click.setPosition(feature.getGeometry()?.getCoordinates())
    }
}

export function updateFlightOverlay(mapRef: RefObject<MapStorage>) {
    const overlays = mapRef.current?.overlays
    const features = mapRef.current?.features

    if (overlays?.hover && features?.hover?.get('type') === 'flight') {
        const root = overlays.hover.get('root')
        root.render(<FlightOverlay feature={features.hover} click={false} />)
    }

    if (overlays?.click && features?.click?.get('type') === 'flight') {
        const root = overlays.click.get('root')
        root.render(<FlightOverlay feature={features.click} click={true} />)
    }
}

export function getLiveData(feature: Feature | null): LiveFlightData | null {
    const timestamp = feature?.get('timestamp')
    const attitude = feature?.get('attitude') as Attitude
    if (!timestamp || !attitude) return null

    const elapsedTime = Date.now() - new Date(timestamp).getTime()

    return {
        altitude: roundNumToX(attitude.altitudes[0] + attitude.altitudes[1] / 60 * elapsedTime / 1000, 25),
        radar: roundNumToX(attitude.altitudes[2] + attitude.altitudes[1] / 60 * elapsedTime / 1000, 25),
        groundspeed: roundNumToX(attitude.groundspeeds[0] + attitude.groundspeeds[1] / 60 * elapsedTime / 1000, 1),
        heading: attitude.heading,
        fpm: attitude.altitudes[1] >= 0 ? '+' + attitude.altitudes[1] : '-' + Math.abs(attitude.altitudes[1])
    }
}

export function createAirportOverlay(mapRef: RefObject<MapStorage>, feature: Feature<Point>): Overlay | null {
    if (!mapRef.current?.map) return null

    const id = feature.getId()
    const labelFeature = id ? mapRef.current.sources.airportLabels.getFeatureById(id) : null

    const element = document.createElement('div')
    const root = createRoot(element)
    root.render(<AirportOverlay feature={labelFeature ?? feature} />)

    const overlay = new Overlay({
        element,
        position: feature.getGeometry()?.getCoordinates(),
        positioning: 'bottom-center',
        offset: [0, -22],
        id: feature.get('callsign')
    })
    overlay.set('root', root)
    mapRef.current?.map.addOverlay(overlay)

    return overlay
}

export function updateAirportOverlay(mapRef: RefObject<MapStorage>) {
    const overlays = mapRef.current?.overlays
    const features = mapRef.current?.features

    if (overlays?.hover && features?.hover?.get('type')?.includes('airport')) {
        const id = features.hover.getId()
        const labelFeature = id ? mapRef.current!.sources.airportLabels.getFeatureById(id) : null

        const root = overlays.hover.get('root')
        root.render(<AirportOverlay feature={labelFeature ?? features.hover} />)
    }

    if (overlays?.click && features?.click?.get('type')?.includes('airport')) {
        const id = features.click.getId()
        const labelFeature = id ? mapRef.current!.sources.airportLabels.getFeatureById(id) : null

        const root = overlays.click.get('root')
        root.render(<AirportOverlay feature={labelFeature ?? features.click} />)
    }
}

// export const createATCPopup = (map, feature) => {
//     const element = document.createElement('div')
//     const root = createRoot(element)
//     root.render(<ATCPopup feature={feature} />)

//     const popupOverlay = new Overlay({
//         element,
//         position: feature.getGeometry().getCoordinates(),
//         positioning: 'bottom-center',
//         offset: [0, -24],
//         id: feature.get('desc')
//     })
//     popupOverlay.set('root', root)

//     map.addOverlay(popupOverlay)

//     return popupOverlay
// }