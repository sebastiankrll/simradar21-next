import { rawDataStorage, vatsimDataStorage } from "@/storage/singleton/vatsim"
import { ControllerData, ControllerIndex, VatsimATIS, VatsimController, VatsimTransceiver, VatsimTransceiversData } from "@/types/vatsim"
import airportsJSON from '@/assets/data/airports_full.json'
import { FeatureCollection } from "geojson"
import { calculateDistance } from "@/utils/common"
import { distance } from "ol/coordinate"

const airports = airportsJSON as FeatureCollection

type ControllerMap = Record<string, ControllerIndex>
type TransceiverFrequencyMap = Record<string, { callsign: string, transceiver: VatsimTransceiver }[]>

export function updateController() {
    if (!rawDataStorage.vatsim?.controllers) return

    const newControllers: ControllerMap = {}

    for (const controller of rawDataStorage.vatsim.controllers) {
        const newController = getControllerData(controller)
        if (newController) { newControllers[controller.callsign] = newController }
    }

    for (const atis of rawDataStorage.vatsim.atis) {
        const newController = getControllerData(atis)
        if (newController) {
            newController.facility = -1
            newControllers[atis.callsign] = newController
        }
    }

    const transceiversByFrequency = getTransceiversByFrequency(rawDataStorage.transveivers)
    addControllerConnectionCounts(newControllers, transceiversByFrequency)

    vatsimDataStorage.controller = {
        airports: filterAirports(newControllers),
        firs: filterFirs(newControllers),
        tracons: filterTracons(newControllers)
    }
}

function getControllerData(controller: VatsimController): ControllerIndex | null {
    if (controller.frequency === '199.998') {
        return null
    }

    return {
        type: getStationType(controller.facility),
        facility: controller.facility,
        callsign: controller.callsign,
        frequency: controller.frequency,
        text: controller.text_atis,
        connections: 0,
        logon: new Date(controller.logon_time)
    }
}

function getTransceiversByFrequency(transceiversData: VatsimTransceiversData[] | null): TransceiverFrequencyMap {
    const flatTransceivers: { callsign: string, transceiver: VatsimTransceiver }[] = []

    transceiversData?.forEach((data) => {
        const uniqueFrequencies = new Set<number>()

        data.transceivers.forEach((transceiver) => {
            if (!uniqueFrequencies.has(transceiver.frequency)) {
                uniqueFrequencies.add(transceiver.frequency)
                flatTransceivers.push({ callsign: data.callsign, transceiver })
            }
        })
    })

    const transceiversByFrequency: TransceiverFrequencyMap = {}

    flatTransceivers.forEach(({ callsign, transceiver }) => {
        const frequency = (transceiver?.frequency / 1000000).toFixed(3)

        if (!transceiversByFrequency[frequency]) { transceiversByFrequency[frequency] = [] }
        transceiversByFrequency[frequency].push({ callsign, transceiver })
    })

    return transceiversByFrequency
}

function addControllerConnectionCounts(controllers: ControllerMap, transceiversByFrequency: TransceiverFrequencyMap) {
    for (const callsign of Object.keys(controllers)) {
        const frequency = controllers[callsign].frequency
        if (!transceiversByFrequency[frequency]) continue

        const controllerTransceivers = transceiversByFrequency[frequency].filter(t => t.callsign.includes('_'))
        const pilotTransceivers = transceiversByFrequency[frequency].filter(t => !t.callsign.includes('_'))

        if (controllerTransceivers.length === 1) {
            controllers[callsign].connections = pilotTransceivers.length
        } else {
            pilotTransceivers.forEach(pilot => {
                const closestController = {
                    callsign: "",
                    distance: 0
                }
                const pilotPos = [pilot.transceiver.lonDeg, pilot.transceiver.latDeg]

                controllerTransceivers.forEach(controller => {
                    const controllerPos = [controller.transceiver.lonDeg, controller.transceiver.latDeg]
                    const distance = calculateDistance(controllerPos, pilotPos)

                    if (distance < closestController.distance) {
                        closestController.callsign = controller.callsign
                        closestController.distance = distance
                    }
                })

                if (closestController.callsign === callsign) { controllers[callsign].connections++ }
            })
        }
    }
}

function filterFirs(controllers: ControllerMap): Record<string, ControllerIndex[]> {
    const filteredFirs: Record<string, ControllerIndex[]> = {}
    return filteredFirs
}

function filterTracons(controllers: ControllerMap): Record<string, ControllerIndex[]> {
    const filteredTracons: Record<string, ControllerIndex[]> = {}
    return filteredTracons
}

function filterAirports(controllers: ControllerMap): Record<string, ControllerIndex[]> {
    const filteredAirports: Record<string, ControllerIndex[]> = {}

    for (const callsign of Object.keys(controllers)) {
        if (controllers[callsign].type !== 'airport') continue

        let icao = callsign.split('_')[0]

        if (icao.length !== 4) {
            const feature = airports.features.find(airport => airport.properties?.iata === icao)
            icao = feature?.properties?.icao
        }

        if (!icao) continue

        if (!filteredAirports[icao]) { filteredAirports[icao] = [] }
        filteredAirports[icao].push(controllers[callsign])
    }

    return filteredAirports
}

function getStationType(facility: number): string {
    switch (facility) {
        case 1:
        case 6:
            return 'fir'
        case 5:
            return 'tracon'
        case 2:
        case 3:
        case 4:
            return 'airport'
        default:
            return 'airport'
    }
}