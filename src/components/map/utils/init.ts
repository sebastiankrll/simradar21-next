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
import { mapStorage } from "@/storage/singleton/map"
import { handlePathChange } from "./misc"

export function initLayers() {
    if (!mapStorage.map) return

    const mbLayer = new MapLibreLayer({
        mapLibreOptions: {
            style: mapLibreStyle as StyleSpecification,
        },
        properties: { type: 'base' }
    })
    mapStorage.map.addLayer(mbLayer)

    const sunLayer = new WebGLLayer({
        source: mapStorage.sources.sun,
        style: webglConfig.sun as VectorStyle,
        properties: { type: 'sun' }
    })
    mapStorage.map.addLayer(sunLayer)

    const firLayer = new WebGLLayer({
        source: mapStorage.sources.firs,
        style: webglConfig.firs,
        properties: { type: 'firs' }
    })
    firLayer.setZIndex(1)
    mapStorage.map.addLayer(firLayer)

    const traconLayer = new WebGLLayer({
        source: mapStorage.sources.tracons,
        style: webglConfig.firs,
        properties: { type: 'tracons' }
    })
    traconLayer.setZIndex(2)
    mapStorage.map.addLayer(traconLayer)

    const routeLayer = new VectorLayer({
        source: mapStorage.sources.tracks,
        properties: { type: 'routes' }
    })
    routeLayer.setZIndex(3)
    mapStorage.map.addLayer(routeLayer)

    const shadowLayer = new WebGLPointsLayer({
        source: mapStorage.sources.flights as VectorSource<FeatureLike>,
        style: webglConfig.shadows,
        properties: { type: 'shadows' }
    })
    shadowLayer.setZIndex(4)
    mapStorage.map.addLayer(shadowLayer)

    const flightLayer = new WebGLPointsLayer({
        source: mapStorage.sources.flights as VectorSource<FeatureLike>,
        style: webglConfig.flights,
        properties: { type: 'flights' }
    })
    flightLayer.setZIndex(5)
    mapStorage.map.addLayer(flightLayer)
    mapStorage.layerInit = new Date()

    const airportLabelLayer = new WebGLPointsLayer({
        source: mapStorage.sources.airportLabels as VectorSource<FeatureLike>,
        style: webglConfig.airportLabels,
        properties: { type: 'airportLabels' }
    })
    airportLabelLayer.setZIndex(6)
    mapStorage.map.addLayer(airportLabelLayer)

    const airportLayer = new WebGLPointsLayer({
        source: mapStorage.sources.airports as VectorSource<FeatureLike>,
        style: webglConfig.airports,
        properties: { type: 'airports' }
    })
    airportLayer.setZIndex(7)
    mapStorage.map.addLayer(airportLayer)

    const airportTopLayer = new WebGLPointsLayer({
        source: mapStorage.sources.airportTops as VectorSource<FeatureLike>,
        style: webglConfig.airportTops,
        properties: { type: 'airportTops' }
    })
    airportTopLayer.setZIndex(8)
    mapStorage.map.addLayer(airportTopLayer)

    const firLabelLayer = new VectorLayer({
        source: mapStorage.sources.firLabels,
        style: getFIRStyle as StyleLike,
        properties: { type: 'firLabels' }
    })
    firLabelLayer.setZIndex(9)
    mapStorage.map.addLayer(firLabelLayer)

    initSunLayer()
}

export async function initData(pathname: string, handleNotFound: (found: boolean, path?: string) => void) {
    if (!mapStorage.view.viewInit) {
        const initData: { vatsim: VatsimDataWS, database: DatabaseDataStorage } = await fetcher('/api/data/init')

        // Init indexed-db
        checkAndUpdateData(initData.database)

        // Init features (flights, airports, sectors)
        updateFlightFeatures(initData.vatsim)
        initAirportFeatures(initData.vatsim)

        mapStorage.view.viewInit = true
    }

    handlePathChange(pathname, handleNotFound)
}