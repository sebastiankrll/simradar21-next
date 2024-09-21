import { ChartJsConfig } from "@/components/common/chart/Chart"

export function getChartData(points: string[] | null): ChartJsConfig | null {
    // const filteredPoints = points.filter((value, index) => (index + 1) % 4 === 0)
    // Make a filter, that filters out same points and only keeps differences

    if (!points) return null

    const labels = points.map((point) => new Date(point.split('/')[5]))
    const config: ChartJsConfig = {
        data: {
            labels,
            datasets: [
                {
                    data: points.map((point) => parseInt(point.split('/')[2], 10)),
                    borderColor: 'rgb(234, 89, 121)',
                    pointRadius: 0,
                    borderWidth: 2,
                    yAxisID: 'y',
                },
                {
                    data: points.map((point) => parseInt(point.split('/')[4], 10)),
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

    return config
}