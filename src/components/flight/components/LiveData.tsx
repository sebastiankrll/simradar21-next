'use client'

import { useFlightStore } from "@/storage/state/panel"
import { FlightData } from "@/types/panel"

export default function LiveData({ data }: { data: FlightData }) {
    const { liveData } = useFlightStore()

    return (
        <div className="info-panel-container sub">
            <div className='info-panel-flow-section'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M23.114 7.134c-.854-.547-2.778-.712-5.206-.859-.805-.053-1.803-.111-2.088-.194 0 0-.006-.006-.012-.006-.145-.1-.593-.417-1.205-.852-4.872-3.474-5.847-4.097-6.24-4.185-.327-.047-1.145-.124-1.605.3-.484.47-.29 1.034-.2 1.287.061.14.176.294 1.441 1.863A96 96 0 0 1 9.422 6.27c-1.162.065-3.487.071-3.88.006h-.006c-.34-.147-2.252-1.34-3.94-2.427a.6.6 0 0 0-.322-.095H.608a.62.62 0 0 0-.508.27.57.57 0 0 0-.042.571c2.724 5.608 2.76 5.626 2.966 5.75.2.117 5.181.146 9.975.146 4.486 0 8.807-.023 8.892-.03a.4.4 0 0 0 .085-.01c1.598-.295 1.943-1.112 2.01-1.576.102-.723-.364-1.464-.872-1.74Zm-1.308 2.151c-1.41.041-15.756.024-18.098-.023A344 344 0 0 1 1.777 5.37c2.379 1.523 3.087 1.905 3.341 2.005.109.053.375.153 2.724.117 2.488-.03 2.633-.153 2.803-.288a.6.6 0 0 0 .084-.082c.255-.306.164-.63.115-.823l-.018-.065c-.048-.194-.12-.305-1.87-2.475a83 83 0 0 1-1.26-1.581c.116-.012.28-.012.424.006.63.311 4.22 2.869 5.775 3.98.563.4.987.705 1.174.834.31.277.926.33 2.76.441 1.496.094 4.002.253 4.625.676a1 1 0 0 1 .079.047c.097.053.296.335.254.565-.042.24-.405.447-.98.558Zm-7.602 6.173a.61.61 0 0 0 .854-.006.57.57 0 0 0-.007-.829l-2.578-2.48a.61.61 0 0 0-.842-.007l-2.675 2.481a.574.574 0 0 0-.018.829c.23.235.61.241.853.018l1.604-1.488v7.072l-1.592-1.534a.61.61 0 0 0-.853.006.57.57 0 0 0 .006.829l2.578 2.48a.615.615 0 0 0 .842.006l2.675-2.48a.574.574 0 0 0 .018-.83.616.616 0 0 0-.853-.017l-1.604 1.487v-7.072z" clipRule="evenodd"></path>
                </svg>
            </div>
            <div className="info-panel-container-content" id='aircraft-panel-lnav'>
                <div className="info-panel-data">
                    <p>BAROMETRIC ALT.</p>
                    <div className="info-panel-data-content">{liveData?.altitude.toLocaleString() + ' ft'}</div>
                </div>
                <div className="info-panel-data">
                    <p>VERTICAL SPEED</p>
                    <div className="info-panel-data-content">{liveData?.fpm + ' fpm'}</div>
                </div>
                <div className="info-panel-data">
                    <p>RADAR ALT.</p>
                    <div className="info-panel-data-content">{liveData?.radar.toLocaleString() + ' ft'}</div>
                </div>
                <div className="info-panel-data">
                    <p>TRACK</p>
                    <div className="info-panel-data-content">{liveData?.heading + '°'}</div>
                </div>
                <div className="info-panel-data">
                    <p>ALTIMETER</p>
                    <div className="info-panel-data-content">{data.status?.index.altimeters + ' hPa'}</div>
                </div>
                <div className="info-panel-data">
                    <p>GROUND SPEED</p>
                    <div className="info-panel-data-content">{liveData?.groundspeed + ' kts'}</div>
                </div>
            </div>
        </div>
    )
}