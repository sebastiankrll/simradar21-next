import { MapStorage } from "@/types/map"
import { Feature, Overlay } from "ol"
import { RefObject } from "react"
import { createRoot } from "react-dom/client"
import { FlightOverlay } from "../components/overlays"
import { Point } from "ol/geom"

export function createFlightOverlay(mapRef: RefObject<MapStorage>, feature: Feature<Point>): Overlay | null {
    if (!mapRef.current?.map) return null

    const element = document.createElement('div')
    const root = createRoot(element)
    root.render(<FlightOverlay feature={feature} />)

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

// export const createAirportPopup = (map, feature, airportsRef) => {
//     const element = document.createElement('div')
//     const root = createRoot(element)
//     root.render(<AirportPopup feature={feature} airport={airportsRef.current[feature.get('icao')]} />)

//     const popupOverlay = new Overlay({
//         element,
//         position: feature.getGeometry().getCoordinates(),
//         positioning: 'bottom-center',
//         offset: [0, -24],
//         id: feature.get('icao')
//     })
//     popupOverlay.set('root', root)

//     map.addOverlay(popupOverlay)

//     return popupOverlay
// }

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

export function updateOverlayPosition(mapRef: RefObject<MapStorage>) {
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

// export const updateFlightPopupContent = (popupRef, feature) => {
//     const popups = [popupRef.current.click, popupRef.current.hover]

//     popups.forEach(popup => {
//         if (popup?.getId() === feature.get('callsign')) {
//             const root = popup.get('root')
//             root.render(<FlightPopup feature={feature} />)
//         }
//     })
// }