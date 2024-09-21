import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    ChartData,
    ChartOptions
} from 'chart.js'
// import 'chartjs-adapter-date-fns'

import './Chart.css'

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
)

export interface ChartJsConfig {
    data: ChartData<'line', number[], string | number | Date | undefined>,
    options: ChartOptions<'line'>,
    names: string[]
}

export default function Chart({ param }: { param: ChartJsConfig | null }) {
    if (param) {
        return (
            <>
                <div className='chart-legend'>
                    <div className='chart-legend-item'>
                        <div className='chart-legend-dot red'></div>
                        <p>{param.names[0]}</p>
                    </div>
                    <div className='chart-legend-item'>
                        <p>{param.names[1]}</p>
                        <div className='chart-legend-dot green'></div>
                    </div>
                </div>
                <div className='chart-wrapper'>
                    <Line options={param.options} data={param.data} />
                </div>
            </>
        )
    }

    return (
        <>
            <div className='chart-legend'>
                <div className='chart-legend-item'>
                    <div className='chart-legend-dot red'></div>
                    <p>NO DATA</p>
                </div>
                <div className='chart-legend-item'>
                    <p>NO DATA</p>
                    <div className='chart-legend-dot green'></div>
                </div>
            </div>
            <div className='chart-wrapper'></div>
        </>
    )
}