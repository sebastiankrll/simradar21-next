import { getAllAirports, getSelectedAirports } from "@/storage/client-database";
import { IndexedAirportFeature, MapStorage } from "@/types/map";
import bbox from "@turf/bbox";
import { BBox } from "geojson";
import { fromLonLat, transformExtent } from "ol/proj";
import RBush from "rbush";
import { RefObject } from "react";
import GeoJSON from 'ol/format/GeoJSON'
import { VatsimDataWS } from "@/types/vatsim";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { createAirportOverlay, updateAirportOverlay } from "./overlay";
import { boundingExtent } from "ol/extent";
import { webglConfig } from "./webgl";

const rbush = new RBush<IndexedAirportFeature>()
let inOutBounds: { [key: string]: number[] } = {}

export async function initAirportFeatures(mapRef: RefObject<MapStorage>, vatsimData: VatsimDataWS | null) {
    const airportFeatures = await getAllAirports()
    if (!airportFeatures) return

    const indexedFeatures: IndexedAirportFeature[] = airportFeatures.map((feature) => {
        const [minX, minY, maxX, maxY]: BBox = bbox(feature)
        return {
            minX,
            minY,
            maxX,
            maxY,
            feature,
        }
    })
    rbush.load(indexedFeatures)
    setAirportFeaturesByExtent(mapRef)
    updateAirportFeatures(mapRef, vatsimData)
}

export function setAirportFeaturesByExtent(mapRef: RefObject<MapStorage>) {
    const map = mapRef.current?.map
    const resolution = map?.getView().getResolution()
    if (!resolution || !map) {
        mapRef.current?.sources.airports.clear()
        return
    }

    let sizeArray = null

    if (resolution <= 3000) {
        sizeArray = ['large_airport']
    }

    if (resolution < 1000) {
        sizeArray = ['large_airport', 'medium_airport']
    }

    if (resolution < 300) {
        sizeArray = ['large_airport', 'medium_airport', 'small_airport']
    }

    if (!sizeArray) {
        mapRef.current?.sources.airports.clear()
        return
    }

    const [minX, minY, maxX, maxY] = transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326')
    const featuresByExtent = rbush.search({ minX, minY, maxX, maxY }).map((entry) => entry.feature)
    const featuresBySize = sizeArray ? featuresByExtent.filter(feature => sizeArray.includes(feature.properties?.type)) : []

    mapRef.current?.sources.airports.clear()
    mapRef.current?.sources.airports.addFeatures(
        new GeoJSON().readFeatures({
            type: 'FeatureCollection',
            features: featuresBySize
        }, {
            featureProjection: 'EPSG:3857',
        })
    )
}

export async function updateAirportFeatures(mapRef: RefObject<MapStorage>, vatsimData: VatsimDataWS | null) {
    const controllers = vatsimData?.controllers?.airports
    if (!controllers) return

    const icaos = Object.keys(controllers)
    const features = await getSelectedAirports(icaos)
    if (!features) return

    const newFeatures: typeof features = []

    for (const feature of features) {
        if (!feature.properties) continue

        const icao: string = feature.properties.icao
        const stations = [0, 0, 0, 0]

        controllers[icao].forEach(station => {
            if (station.facility === -1) {
                stations[3] = 1
            }
            if (station.facility === 2) {
                stations[2] = 1
            }
            if (station.facility === 3) {
                stations[1] = 1
            }
            if (station.facility === 4) {
                stations[0] = 1
            }
        })

        feature.properties.offset = parseInt(stations.join(''), 2) * 36
        feature.properties.stations = controllers[icao]

        newFeatures.push(feature)
    }

    mapRef.current?.sources.airportLabels.clear()
    mapRef.current?.sources.airportLabels.addFeatures(
        new GeoJSON().readFeatures({
            type: 'FeatureCollection',
            features: newFeatures
        }, {
            featureProjection: 'EPSG:3857',
        })
    )

    calculateInAndOutBounds(vatsimData)
    updateAirportOverlay(mapRef)
}

function calculateInAndOutBounds(vatsimData: VatsimDataWS) {
    const flights = vatsimData.flights
    if (!flights) return

    inOutBounds = {}

    for (const flight of flights) {
        if (!flight.airports) continue

        if (!inOutBounds[flight.airports[0]]) {
            inOutBounds[flight.airports[0]] = [1, 0]
        } else {
            inOutBounds[flight.airports[0]][0]++
        }

        if (!inOutBounds[flight.airports[1]]) {
            inOutBounds[flight.airports[1]] = [0, 1]
        } else {
            inOutBounds[flight.airports[1]][1]++
        }
    }
}

export function getInAndOutBounds(icao: string): number[] {
    return inOutBounds[icao] ? inOutBounds[icao] : [0, 0]
}

export async function setClickedAirportFeature(mapRef: RefObject<MapStorage>, icao: string, feature: Feature<Point> | null) {
    if (!mapRef.current?.map) return

    if (feature) {
        mapRef.current.sources.airportTops.addFeature(feature)
        return
    }

    const storedFeature = await getSelectedAirports([icao])
    if (!storedFeature) return

    const newFeature = new GeoJSON().readFeature(storedFeature[0], {
        featureProjection: 'EPSG:3857',
    }) as Feature<Point>

    // Clean up old previous overlay first (dev mode only due to strict mode)
    if (mapRef.current.overlays.click && process.env.NODE_ENV === 'development') {
        const root = mapRef.current.overlays.click.get('root')
        setTimeout(() => {
            root?.unmount()
        }, 0)

        mapRef.current.map.removeOverlay(mapRef.current.overlays.click)
        mapRef.current.overlays.click = null
    }

    if (mapRef.current.features.click && process.env.NODE_ENV === 'development') {
        mapRef.current?.sources.airportTops.removeFeature(mapRef.current.features.click)
    }

    newFeature.set('hover', 1)
    mapRef.current?.sources.airportTops.addFeature(newFeature)
    mapRef.current.features.click = newFeature

    const overlay = createAirportOverlay(mapRef, newFeature as Feature<Point>)
    mapRef.current.overlays.click = overlay
}

export async function showFlightRoute(mapRef: RefObject<MapStorage>) {
    const clickedFeature = mapRef.current?.features.click
    const map = mapRef.current?.map
    if (!clickedFeature || clickedFeature.get('type') !== 'flight' || !map) return

    mapRef.current.view.lastView = map.getView().calculateExtent(map.getSize())

    const airportIcaos: string[] | null = clickedFeature.get('airports')
    if (!airportIcaos || airportIcaos.length < 2) return

    const airports = await getSelectedAirports(airportIcaos)
    if (!airports || airports.length < 2) return

    const coords = [
        fromLonLat(airports[0].geometry.coordinates),
        fromLonLat(airports[1].geometry.coordinates)
    ]
    const extent = boundingExtent(coords)

    map.getView().fit(extent, {
        duration: 200,
        padding: [150, 100, 100, 468]
    })

    const newFeatures = new GeoJSON().readFeatures({
        type: "FeatureCollection",
        features: airports
    }, {
        featureProjection: 'EPSG:3857',
    })
    newFeatures.forEach(feature => {
        feature.set('hover', 1)
    })
    mapRef.current.sources.airportTops.addFeatures(newFeatures)

    webglConfig.flights.variables.callsign = clickedFeature.get('callsign')
    webglConfig.shadows.variables.callsign = clickedFeature.get('callsign')
    webglConfig.airports.variables.show = ''
    webglConfig.airportLabels.variables.dep = airportIcaos[0]
    webglConfig.airportLabels.variables.arr = airportIcaos[1]
}

export async function hideFlightRoute(mapRef: RefObject<MapStorage>) {
    mapRef.current?.sources.airportTops.clear()

    webglConfig.flights.variables.callsign = 'all'
    webglConfig.shadows.variables.callsign = 'all'
    webglConfig.airports.variables.show = 'all'
    webglConfig.airportLabels.variables.dep = ''
    webglConfig.airportLabels.variables.arr = ''
}