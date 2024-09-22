import { Attitude, MapStorage } from "@/types/map"
import { TrackPoint } from "@/types/vatsim"
import { Feature } from "ol"
import { LineString } from "ol/geom"
import { fromLonLat } from "ol/proj"
import { Stroke, Style } from "ol/style"
import { RefObject } from "react"

export function initTrack(mapRef: RefObject<MapStorage>, trackData: TrackPoint[] | null) {
    const trackFeatures: Feature<LineString>[] = []

    if (!trackData || !mapRef.current) return

    // Add all recorded track segments
    for (let i = 0; i < trackData.length - 1; i++) {
        const start = trackData[i]
        const end = trackData[i + 1]

        const trackFeature = new Feature({
            geometry: new LineString([fromLonLat(start.coordinates), fromLonLat(end.coordinates)]),
            type: 'route',
        })
        const trackStyle = new Style({
            stroke: new Stroke({
                color: getRouteColor(start.altitudes[0], start.altitudes[1]),
                width: 3,
            }),
        })
        trackFeature.setStyle(trackStyle)
        trackFeatures.push(trackFeature)
    }

    mapRef.current.sources.tracks.clear()
    mapRef.current.sources.tracks.addFeatures(trackFeatures)

    // Add first interpolated segment
    const clickedFeature = mapRef.current?.features.click
    if (!clickedFeature) return

    const attitude = clickedFeature.get('attitude') as Attitude
    const start = fromLonLat(attitude.coordinates)
    const end = clickedFeature?.getGeometry()?.getCoordinates()

    if (!start || !end) return

    const trackFeature = new Feature({
        geometry: new LineString([start, end]),
        type: 'route',
    })
    const trackStyle = new Style({
        stroke: new Stroke({
            color: getRouteColor(attitude.altitudes[0], attitude.altitudes[2]),
            width: 3,
        }),
    })
    trackFeature.setStyle(trackStyle)

    mapRef.current.features.track = trackFeature
    mapRef.current.sources.tracks.addFeature(trackFeature)
}

export function moveTrack(mapRef: RefObject<MapStorage>) {
    const clickedFeature = mapRef.current?.features.click
    if (!clickedFeature || mapRef.current.sources.tracks.getFeatures().length < 2) return

    const interpolatedFeature = mapRef.current.features.track
    const attitude = clickedFeature.get('attitude') as Attitude
    const end = clickedFeature?.getGeometry()?.getCoordinates()


    // If interpolated segment does not exist yet, create it
    if (!interpolatedFeature) {
        const start = fromLonLat(attitude.coordinates)

        if (!start || !end) return

        const trackFeature = new Feature({
            geometry: new LineString([start, end]),
            type: 'route',
        })
        const trackStyle = new Style({
            stroke: new Stroke({
                color: getRouteColor(attitude.altitudes[0], attitude.altitudes[2]),
                width: 3,
            }),
        })
        trackFeature.setStyle(trackStyle)

        mapRef.current.features.track = trackFeature
        mapRef.current.sources.tracks.addFeature(trackFeature)

        return
    }

    // If interpolated segment exists, just update its position
    const start = interpolatedFeature.getGeometry()?.getCoordinates()[0]
    if (!start || !end) return
    interpolatedFeature.getGeometry()?.setCoordinates([start, end])
}

export function updateTrack(mapRef: RefObject<MapStorage>) {
    const clickedFeature = mapRef.current?.features.click
    const interpolatedFeature = mapRef.current?.features.track
    if (!clickedFeature || !interpolatedFeature || mapRef.current.sources.tracks.getFeatures().length < 2) return

    // Add new track segment to latest recorded position
    const attitude = clickedFeature.get('attitude') as Attitude
    const start = interpolatedFeature.getGeometry()?.getCoordinates()[0]
    const end = fromLonLat(attitude.coordinates)

    if (!start || !end) return

    const trackFeature = new Feature({
        geometry: new LineString([start, end]),
        type: 'route',
    })
    trackFeature.setStyle(interpolatedFeature.getStyle())
    mapRef.current.sources.tracks.addFeature(trackFeature)

    // Delete previous interpolated segment
    mapRef.current.sources.tracks.removeFeature(interpolatedFeature)

    // Add new interpolated segment
    const newStart = fromLonLat(attitude.coordinates)
    const newEnd = clickedFeature?.getGeometry()?.getCoordinates()

    if (!newStart || !newEnd) return

    const newTrackFeature = new Feature({
        geometry: new LineString([newStart, newEnd]),
        type: 'route',
    })
    const newTrackStyle = new Style({
        stroke: new Stroke({
            color: getRouteColor(attitude.altitudes[0], attitude.altitudes[2]),
            width: 3,
        }),
    })
    newTrackFeature.setStyle(newTrackStyle)

    mapRef.current.features.track = newTrackFeature
    mapRef.current.sources.tracks.addFeature(newTrackFeature)
}

function getRouteColor(altitude: number | null, radar: number | null): string {
    if (!altitude || !radar || radar < 100) return 'rgb(77, 95, 131)'

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

    return `rgb(${resultRGB[0]}, ${resultRGB[1]}, ${resultRGB[2]})`
}