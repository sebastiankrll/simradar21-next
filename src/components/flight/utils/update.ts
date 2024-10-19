import { FlightData, StatusFlightData } from "@/types/panel"
import { convertLengthUnit, getDurationString } from "@/utils/common"

export function getFlightStatus(data: FlightData | undefined | null): StatusFlightData {
    const flightStatus: StatusFlightData = {
        callsign: data?.general?.index.callsign,
        depStatus: 'EST',
        arrStatus: 'EST',
        delayColor: '',
        imgOffset: -60,
        progress: 0,
        startToEnd: ['0 km, 00:00 ago', '0 km, in 00:00']
    }

    if (!data?.status?.times) return flightStatus

    const status = data.status
    const delay = (new Date(status.times.actArr).getTime() - new Date(status.times.schedArr).getTime()) / 60000

    if (delay <= 15) flightStatus.delayColor = 'greenColor'
    if (delay > 15 && delay <= 30) flightStatus.delayColor = 'yellowColor'
    if (delay > 30) flightStatus.delayColor = 'redColor'

    const now = new Date()
    flightStatus.startToEnd[0] = '0 km, in --:--'
    flightStatus.startToEnd[1] = convertLengthUnit(status.progress.arrDist) + ' km, in --:--'

    if (status.progress.status === "In Flight" || status.progress.status === "Taxi In" || status.progress.status === "On Block") {
        flightStatus.depStatus = 'ACT'
        flightStatus.startToEnd[0] = convertLengthUnit(status.progress.depDist) + ' km, ' + getDurationString(now.getTime() - new Date(status.times.actDep).getTime()) + ' ago'
        flightStatus.startToEnd[1] = convertLengthUnit(status.progress.arrDist) + ' km, in ' + getDurationString(new Date(status.times.actArr).getTime() - now.getTime())
    }
    if (status.progress.status === "Taxi In" || status.progress.status === "On Block") {
        flightStatus.arrStatus = 'ACT'
        flightStatus.startToEnd[0] = convertLengthUnit(status.progress.depDist) + ' km, ' + getDurationString(now.getTime() - new Date(status.times.actDep).getTime()) + ' ago'
        flightStatus.startToEnd[1] = '0 km, ' + getDurationString(now.getTime() - new Date(status.times.actArr).getTime()) + ' ago'
    }

    const totalDist = status.progress.depDist + status.progress.arrDist
    flightStatus.progress = Math.floor((1 - status.progress.arrDist / totalDist) * 100)

    const position = data.position
    const general = data.general

    if (!position || !general?.flightplan) return flightStatus

    if (status.progress.status === "Boarding" || status.progress.status === "Taxi Out" || status.progress.status === "Taxi In" || status.progress.status === "On Block") {
        flightStatus.imgOffset = 0
    } else if (flightStatus.progress < 50 && (position.altitudes[0] / general.flightplan.filedLevel) < 0.8 && status.progress.status === "In Flight" && position.altitudes[1] >= 0) {
        flightStatus.imgOffset = -30
    } else if (flightStatus.progress > 50 && (position.altitudes[0] / general.flightplan.filedLevel) < 0.8 && status.progress.status === "In Flight" && position.altitudes[1] <= 0) {
        flightStatus.imgOffset = -90
    }

    return flightStatus
}