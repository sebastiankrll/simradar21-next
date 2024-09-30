import { Attitude, MapStorage } from "@/types/map"
import { TrackData, TrackPoint } from "@/types/vatsim"
import { Feature } from "ol"
import { LineString } from "ol/geom"
import { fromLonLat } from "ol/proj"
import { Stroke, Style } from "ol/style"
import { RefObject } from "react"

export function initTrack(mapRef: RefObject<MapStorage>, trackPoints: TrackPoint[] | null) {
    const trackFeatures: Feature<LineString>[] = []

    if (!trackPoints || !mapRef.current) return

    let combined = []
    let index = 0

    // Add all recorded track segments
    for (let i = 0; i < trackPoints.length - 1; i++) {
        const start = trackPoints[i]
        const end = trackPoints[i + 1]

        if (getRouteColor(start.altitudes[0], start.altitudes[1], start.connected).getColor() === getRouteColor(end.altitudes[0], end.altitudes[1], end.connected).getColor() && i < trackPoints.length - 2) {
            combined.push(start)
            continue
        }
        combined.push(start, end)

        const trackFeature = new Feature({
            geometry: new LineString(combined.map(c => fromLonLat(c.coordinates))),
            type: 'route',
            color: getRouteColor(start.altitudes[0], start.altitudes[1], start.connected).getColor()
        })
        const trackStyle = new Style({
            stroke: getRouteColor(start.altitudes[0], start.altitudes[1], start.connected)
        })
        trackFeature.setStyle(trackStyle)
        trackFeature.setId(i)
        trackFeatures.push(trackFeature)

        combined = []
        index = i + 1
    }

    mapRef.current.sources.tracks.clear()
    mapRef.current.sources.tracks.addFeatures(trackFeatures)

    firstInterpolation(mapRef, index)
}

function firstInterpolation(mapRef: RefObject<MapStorage>, index: number) {
    const clickedFeature = mapRef.current?.features.click
    if (!clickedFeature) return

    const attitude = clickedFeature.get('attitude') as Attitude
    const start = fromLonLat(attitude.coordinates)
    const end = clickedFeature.getGeometry()?.getCoordinates()

    if (!start || !end) return

    const trackFeature = new Feature({
        geometry: new LineString([start, end]),
        type: 'route',
        color: getRouteColor(attitude.altitudes[0], attitude.altitudes[2], clickedFeature.get('connected') === 0 ? false : true).getColor()
    })
    const trackStyle = new Style({
        stroke: getRouteColor(attitude.altitudes[0], attitude.altitudes[2], clickedFeature.get('connected') === 0 ? false : true)
    })
    trackFeature.setStyle(trackStyle)
    trackFeature.setId(index)

    mapRef.current.features.track = trackFeature
    mapRef.current.sources.tracks.addFeature(trackFeature)
}

export function updateTrack(mapRef: RefObject<MapStorage>) {
    const clickedFeature = mapRef.current?.features.click
    if (!clickedFeature || mapRef.current.sources.tracks.getFeatures().length === 0) return

    // Reset interpolated segment
    const interpolatedFeature = mapRef.current?.features.track
    if (mapRef.current?.features.track) {
        mapRef.current.sources.tracks.removeFeature(mapRef.current.features.track)
        mapRef.current.features.track = null
    }

    // Add new track segment to latest recorded position
    const attitude = clickedFeature.get('attitude') as Attitude
    const start = interpolatedFeature?.getGeometry()?.getCoordinates()[0]
    const end = fromLonLat(attitude.coordinates)
    const id = interpolatedFeature?.getId()

    if (!start || !end || !id) return

    const lastId = typeof id === 'string' ? parseInt(id) - 1 : id - 1
    const lastFeature = mapRef.current.sources.tracks.getFeatureById(lastId) as Feature<LineString> | null
    const line = lastFeature?.getGeometry()?.getCoordinates()

    if (interpolatedFeature?.get('color') === lastFeature?.get('color') && line) {
        line.push(end)
        lastFeature!.getGeometry()?.setCoordinates(line)

        firstInterpolation(mapRef, lastId + 1)
    } else {
        const trackFeature = new Feature({
            geometry: new LineString([start, end]),
            type: 'route',
            color: interpolatedFeature?.get('color')
        })
        trackFeature.setStyle(interpolatedFeature.getStyle())
        trackFeature.setId(id)

        mapRef.current.sources.tracks.addFeature(trackFeature)
        firstInterpolation(mapRef, lastId + 2)
    }
}

export function moveTrack(mapRef: RefObject<MapStorage>) {
    const clickedFeature = mapRef.current?.features.click
    const interpolatedFeature = mapRef.current?.features.track
    if (!clickedFeature || !interpolatedFeature) return

    const end = clickedFeature?.getGeometry()?.getCoordinates()
    if (!end) return

    const coords = interpolatedFeature.getGeometry()?.getCoordinates()
    coords?.pop()
    coords?.push(end)

    if (coords) interpolatedFeature.getGeometry()?.setCoordinates(coords)
}

function getRouteColor(altitude: number | null, radar: number | null, connected: boolean): Stroke {
    if (!altitude || !radar || !connected) return new Stroke({
        color: 'rgba(77, 95, 131, 0.7)',
        lineDash: [5, 5],
        lineCap: 'butt',
        width: 3,
    })
    if (radar < 100) return new Stroke({
        color: 'rgb(77, 95, 131)',
        width: 3,
    })

    const degrees = 300 / 50000 * altitude + 60
    const colorSectors = [
        { color: 'red', angle: 0, rgb: [255, 0, 0] },
        { color: 'yellow', angle: 60, rgb: [255, 255, 0] },
        { color: 'green', angle: 120, rgb: [0, 255, 0] },
        { color: 'cyan', angle: 180, rgb: [0, 255, 255] },
        { color: 'blue', angle: 240, rgb: [0, 0, 255] },
        { color: 'magenta', angle: 300, rgb: [255, 0, 255] },
        { color: 'red', angle: 360, rgb: [255, 0, 0] }
    ]

    let lowerBoundIndex = 0
    for (let i = 0; i < colorSectors.length; i++) {
        if (degrees < colorSectors[i].angle) {
            lowerBoundIndex = i - 1
            break
        }
    }

    const lowerBound = colorSectors[lowerBoundIndex]
    const upperBound = colorSectors[lowerBoundIndex + 1]
    const interpolationFactor = (degrees - lowerBound.angle) / (upperBound.angle - lowerBound.angle)

    const resultRGB = []
    for (let i = 0; i < 3; i++) {
        resultRGB[i] = Math.round(lowerBound.rgb[i] + interpolationFactor * (upperBound.rgb[i] - lowerBound.rgb[i]))
    }

    return new Stroke({
        color: `rgb(${resultRGB[0]}, ${resultRGB[1]}, ${resultRGB[2]})`,
        width: 3,
    })
}