import { getSelectedAirports } from "@/storage/client/database"
import { mapStorage } from "@/storage/client/map"
import { OlFlightFeatureAttitude } from "@/types/map"
import { VatsimStorageTrackPoint } from "@/types/vatsim"
import { Feature } from "ol"
import { LineString } from "ol/geom"
import { fromLonLat } from "ol/proj"
import { Stroke, Style } from "ol/style"

export async function initTrack(trackPoints: VatsimStorageTrackPoint[] | null) {
    const trackFeatures: Feature<LineString>[] = []

    if (!trackPoints) return

    const destinationSegment = await initDestinationSegment(trackPoints)
    if (destinationSegment) { trackFeatures.push(destinationSegment) }

    let combined = []
    let index = 1

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
            stroke: getRouteColor(start.altitudes[0], start.altitudes[1], start.connected),

        })
        trackFeature.setStyle(trackStyle)
        trackFeature.setId(i)
        trackFeatures.push(trackFeature)

        combined = []
        index = i + 1
    }

    mapStorage.sources.tracks.clear()
    mapStorage.sources.tracks.addFeatures(trackFeatures)

    firstInterpolation(index)
}

async function initDestinationSegment(trackPoints: VatsimStorageTrackPoint[] | null): Promise<Feature<LineString> | undefined> {
    if (!trackPoints) return

    const airports = mapStorage.features.click?.get('airports') as string[] | undefined
    if (!airports) return

    const geojsons = await getSelectedAirports([airports[1]])
    if (!geojsons || geojsons.length < 1) return

    const start = trackPoints[trackPoints.length - 1].coordinates
    const end = geojsons[0].geometry.coordinates

    const trackFeature = new Feature({
        geometry: new LineString([fromLonLat(start), fromLonLat(end)]),
        type: 'route',
        color: getRouteColor(0, 0, false).getColor()
    })

    const stroke = getRouteColor(0, 0, false)
    stroke.setColor('rgba(77, 95, 131, 0)')

    const trackStyle = new Style({
        stroke: stroke
    })
    trackFeature.setStyle(trackStyle)
    trackFeature.setId(0)

    return trackFeature
}

function updateDestinationSegment(start: number[]) {
    const segment = mapStorage.sources.tracks.getFeatureById(0) as Feature<LineString>
    if (!segment) return

    const coords = segment.getGeometry()?.getCoordinates()
    coords?.shift()
    coords?.unshift(start)

    if (coords) segment.getGeometry()?.setCoordinates(coords)
}

export function toggleDestinationSegment(toggle: boolean) {
    const trackSegment = mapStorage.sources.tracks.getFeatureById(0) as Feature<LineString>
    if (!trackSegment) return

    const style = trackSegment.getStyle() as Style
    const stroke = style.getStroke()

    stroke?.setColor(toggle ? 'rgba(77, 95, 131, 0.7)' : 'rgba(77, 95, 131, 0)')
    trackSegment.setStyle(style)
}

function firstInterpolation(index: number) {
    const clickedFeature = mapStorage.features.click
    if (!clickedFeature) return

    const attitude = clickedFeature.get('attitude') as OlFlightFeatureAttitude
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

    mapStorage.features.track = trackFeature
    mapStorage.sources.tracks.addFeature(trackFeature)

    updateDestinationSegment(end)
}

export function updateTrack() {
    const clickedFeature = mapStorage.features.click
    if (!clickedFeature || mapStorage.sources.tracks.getFeatures().length === 0) return

    // Reset interpolated segment
    const interpolatedFeature = mapStorage.features.track
    if (mapStorage.features.track) {
        mapStorage.sources.tracks.removeFeature(mapStorage.features.track)
        mapStorage.features.track = null
    }

    // Add new track segment to latest recorded position
    const attitude = clickedFeature.get('attitude') as OlFlightFeatureAttitude
    const start = interpolatedFeature?.getGeometry()?.getCoordinates()[0]
    const end = fromLonLat(attitude.coordinates)
    const id = interpolatedFeature?.getId()

    if (!start || !end || !id) return

    const lastId = typeof id === 'string' ? parseInt(id) - 1 : id - 1
    const lastFeature = mapStorage.sources.tracks.getFeatureById(lastId) as Feature<LineString> | null
    const line = lastFeature?.getGeometry()?.getCoordinates()

    if (interpolatedFeature?.get('color') === lastFeature?.get('color') && line) {
        line.push(end)
        lastFeature!.getGeometry()?.setCoordinates(line)

        firstInterpolation(lastId + 1)
    } else {
        const trackFeature = new Feature({
            geometry: new LineString([start, end]),
            type: 'route',
            color: interpolatedFeature?.get('color')
        })
        trackFeature.setStyle(interpolatedFeature.getStyle())
        trackFeature.setId(id)

        mapStorage.sources.tracks.addFeature(trackFeature)
        firstInterpolation(lastId + 2)
    }
}

export function moveTrack() {
    const clickedFeature = mapStorage.features.click
    const interpolatedFeature = mapStorage?.features.track
    if (!clickedFeature || !interpolatedFeature) return

    const end = clickedFeature?.getGeometry()?.getCoordinates()
    if (!end) return

    const coords = interpolatedFeature.getGeometry()?.getCoordinates()
    coords?.pop()
    coords?.push(end)

    if (coords) { interpolatedFeature.getGeometry()?.setCoordinates(coords) }

    updateDestinationSegment(end)
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