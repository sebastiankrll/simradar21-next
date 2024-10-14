import { rawDataStorage, vatsimDataStorage } from "@/storage/singletons/vatsim"
import { ControllerData, ControllerIndex, VatsimATIS, VatsimController } from "@/types/vatsim"
import airportsJSON from '@/assets/data/airports_full.json'
import { FeatureCollection } from "geojson"

const airports = airportsJSON as FeatureCollection

export function updateController() {
    if (!rawDataStorage.vatsim?.controllers) return

    const newControllers = []

    for (const controller of rawDataStorage.vatsim.controllers) {
        const newController = getControllerData(controller)
        if (newController) newControllers.push(newController)
    }

    const firs = newControllers.filter(controller => controller.type === 'fir')
    const tracons = newControllers.filter(controller => controller.type === 'tracon')
    const airports = newControllers.filter(controller => controller.type === 'airport')

    const filteredFirs = filterFirs(firs)
    const filteredTracons = filterTracons(tracons)
    const filteredAirports = filterAirports(airports, rawDataStorage.vatsim.atis)

    vatsimDataStorage.controller = { ...filteredFirs, ...filteredTracons, ...filteredAirports }
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
        logon: new Date(controller.logon_time)
    }
}

function filterFirs(controllers: ControllerIndex[]): ControllerData {
    const filteredFirs: ControllerData = {}
    return filteredFirs
}

function filterTracons(controllers: ControllerIndex[]): ControllerData {
    const filteredTracons: ControllerData = {}
    return filteredTracons
}

function filterAirports(controllers: ControllerIndex[], atiss: VatsimATIS[]): ControllerData {
    const filteredAirports: ControllerData = {}

    for (const controller of controllers) {
        let icao = controller.callsign.split('_')[0]

        if (icao.length !== 4) {
            const feature = airports.features.find(airport => airport.properties?.iata === icao)
            icao = feature?.properties?.icao
        }

        if (!icao) continue

        if (!filteredAirports[icao]) {
            filteredAirports[icao] = []
        }

        controller.callsign = controller.callsign.replace('__', '_')
        filteredAirports[icao].push(controller)
    }

    for (const atis of atiss) {
        let icao = atis.callsign.split('_')[0]

        if (icao.length !== 4) {
            const feature = airports.features.find(airport => airport.properties?.iata === icao)
            icao = feature?.properties?.icao
        }

        if (!icao) continue

        if (!filteredAirports[icao]) {
            filteredAirports[icao] = []
        }

        const newController: ControllerIndex = {
            type: 'airport',
            facility: -1,
            callsign: atis.callsign.replace('__', '_'),
            frequency: atis.frequency,
            text: atis.text_atis,
            logon: new Date(atis.logon_time)
        }
        filteredAirports[icao].push(newController)
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