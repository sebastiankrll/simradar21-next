import { MapStorage } from "@/types/map"
import { RefObject } from "react"
import { MapLibreLayer } from "@geoblocks/ol-maplibre-layer"
import mapLibreStyle from '@/assets/styles/positron.json'
import { StyleSpecification } from "maplibre-gl"
import { webglConfig, WebGLLayer } from "./webgl"
import VectorSource from "ol/source/Vector"
import { VectorStyle } from "ol/render/webgl/VectorStyleRenderer"
import VectorLayer from "ol/layer/Vector"
import WebGLPointsLayer from "ol/layer/WebGLPoints"
import { FeatureLike } from "ol/Feature"
import { StyleLike } from "ol/style/Style"
import { getFIRStyle } from "./style"
import { initSunLayer } from "./sun"
import { fetcher } from "@/utils/api/api"
import { VatsimDataWS } from "@/types/vatsim"
import { updateFlightFeatures } from "./flights"
import { DatabaseDataStorage } from "@/types/database"
import { checkAndUpdateData } from "@/storage/client-database"
import { initAirportFeatures } from "./airports"

export function initLayers(mapRef: RefObject<MapStorage | null>) {
    if (!mapRef.current?.map) return

    const mbLayer = new MapLibreLayer({
        mapLibreOptions: {
            style: mapLibreStyle as StyleSpecification,
        },
        properties: { type: 'base' }
    })
    mapRef.current?.map.addLayer(mbLayer)

    const sunLayer = new WebGLLayer({
        source: mapRef.current.sources.sun,
        style: webglConfig.sun as VectorStyle,
        properties: { type: 'sun' }
    })
    mapRef.current?.map.addLayer(sunLayer)

    const firLayer = new WebGLLayer({
        source: mapRef.current.sources.firs,
        style: webglConfig.firs,
        properties: { type: 'firs' }
    })
    firLayer.setZIndex(1)
    mapRef.current?.map.addLayer(firLayer)

    const traconLayer = new WebGLLayer({
        source: mapRef.current.sources.tracons,
        style: webglConfig.firs,
        properties: { type: 'tracons' }
    })
    traconLayer.setZIndex(2)
    mapRef.current?.map.addLayer(traconLayer)

    const routeLayer = new VectorLayer({
        source: mapRef.current.sources.tracks,
        properties: { type: 'routes' }
    })
    routeLayer.setZIndex(3)
    mapRef.current?.map.addLayer(routeLayer)

    const shadowLayer = new WebGLPointsLayer({
        source: mapRef.current.sources.flights as VectorSource<FeatureLike>,
        style: webglConfig.shadows,
        properties: { type: 'shadows' }
    })
    shadowLayer.setZIndex(4)
    mapRef.current?.map.addLayer(shadowLayer)

    const flightLayer = new WebGLPointsLayer({
        source: mapRef.current.sources.flights as VectorSource<FeatureLike>,
        style: webglConfig.flights,
        properties: { type: 'flights' }
    })
    flightLayer.setZIndex(5)
    mapRef.current?.map.addLayer(flightLayer)
    mapRef.current.layerInit = new Date()

    const airportLabelLayer = new WebGLPointsLayer({
        source: mapRef.current.sources.airportLabels as VectorSource<FeatureLike>,
        style: webglConfig.airportLabels,
        properties: { type: 'airportLabels' }
    })
    airportLabelLayer.setZIndex(6)
    mapRef.current?.map.addLayer(airportLabelLayer)

    const airportLayer = new WebGLPointsLayer({
        source: mapRef.current.sources.airports as VectorSource<FeatureLike>,
        style: webglConfig.airports,
        properties: { type: 'airports' }
    })
    airportLayer.setZIndex(7)
    mapRef.current?.map.addLayer(airportLayer)

    const airportTopLayer = new WebGLPointsLayer({
        source: mapRef.current.sources.airportTops as VectorSource<FeatureLike>,
        style: webglConfig.airportTops,
        properties: { type: 'airportTops' }
    })
    airportTopLayer.setZIndex(8)
    mapRef.current?.map.addLayer(airportTopLayer)

    const firLabelLayer = new VectorLayer({
        source: mapRef.current.sources.firLabels,
        style: getFIRStyle as StyleLike,
        properties: { type: 'firLabels' }
    })
    firLabelLayer.setZIndex(9)
    mapRef.current?.map.addLayer(firLabelLayer)

    initSunLayer(mapRef)
}

export async function initData(mapRef: RefObject<MapStorage | null>) {
    if (mapRef.current && !mapRef.current.view.viewInit) {
        const initData: { vatsim: VatsimDataWS, database: DatabaseDataStorage } = await fetcher('/api/data/init')

        // Init indexed-db
        checkAndUpdateData(initData.database)

        // Init features (flights, airports, sectors)
        updateFlightFeatures(mapRef, initData.vatsim)
        initAirportFeatures(mapRef, initData.vatsim)

        mapRef.current.view.viewInit = true
    }
}