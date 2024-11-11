import { ChartJsConfig } from "@/components/common/chart/Chart"
import { FlightData, TrackPoint } from "@/types/vatsim"

export const flightChartConfig: ChartJsConfig = {
    data: {
        labels: [],
        datasets: [
            {
                data: [],
                borderColor: 'rgb(234, 89, 121)',
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: 'y',
            },
            {
                data: [],
                borderColor: 'rgb(11, 211, 167)',
                pointRadius: 0,
                borderWidth: 2,
                yAxisID: 'y1',
            }
        ]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    displayFormats: {
                        hour: 'HH:mm',
                    },
                },
                display: false
            },
            y: {
                display: false
            },
            y1: {
                display: false
            },
        },
        plugins: {
            legend: {
                display: false
            },
        },
    },
    names: ['BAROMETRIC ALTITUDE', 'GROUND SPEED']
}

export function setFlightChartData(points: TrackPoint[] | null) {
    // const filteredPoints = points.filter((value, index) => (index + 1) % 4 === 0)
    // Make a filter, that filters out same points and only keeps differences

    if (!points) return null

    flightChartConfig.data.labels = points.map((point) => new Date(point.timestamp))
    flightChartConfig.data.datasets[0].data = points.map((point) => point.altitudes[0])
    flightChartConfig.data.datasets[1].data = points.map((point) => point.groundspeed)
}

export function updateFlightChartData(newPoint: FlightData | null) {
    if (!newPoint?.position || flightChartConfig.data.labels?.length === 0) return

    flightChartConfig.data.labels?.push(new Date(newPoint.position.timestamp))
    flightChartConfig.data.datasets[0].data.push(newPoint.position.altitudes[0])
    flightChartConfig.data.datasets[1].data.push(newPoint.position.groundspeeds[0])
}