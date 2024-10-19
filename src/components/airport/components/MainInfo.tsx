'use client'

import { AirportAPIData } from "@/types/vatsim"
import { fetcher } from "@/utils/api/api"
import { setHeight } from "@/utils/gui"
import { useState } from "react"
import useSWR from "swr"

export default function MainInfo({ icao }: { icao: string }) {
    const { data } = useSWR<AirportAPIData | null>(`/api/data/airport/${icao}`, fetcher, {
        revalidateOnFocus: false
    })
    const [panelStates, setPanelStates] = useState({
        metar: false
    })

    const openMetarInfo = (e: React.MouseEvent<HTMLElement>) => {
        setHeight(e, panelStates.metar)
        setPanelStates((prevState) => ({
            ...prevState,
            metar: !panelStates.metar
        }))
    }

    const getDynamicFont = (text: string) => {
        if (!text || text.length < 10) return ''
        if (text.length < 12) return '.875rem'
        return '.75rem'
    }

    if (!data || (!data.data && !data.weather)) return

    return (
        <>
            {data.weather &&
                <div className="info-panel-container column">
                    <div id="airport-panel-weather">
                        <div className="airport-weather-condition">
                            <div className="airport-weather-header">CONDITIONS</div>
                            <p style={{ fontSize: getDynamicFont(data.weather.condition) }}>{data.weather.condition}</p>
                        </div>
                        <div className="airport-weather-condition">
                            <div className="airport-weather-header">TEMPERATURE</div>
                            <p>{data.weather.temperature}</p>
                        </div>
                        <div className="airport-weather-condition">
                            <div className="airport-weather-header">WIND</div>
                            <p>{data.weather.wind}</p>
                        </div>
                    </div>
                </div>
            }
            <div className="info-panel-container column main scrollable">
                {data.weather &&
                    <div className={`info-panel-container column sub dropdown ${panelStates.metar ? 'open' : ''}`}>
                        <button className='info-panel-container-header' onClick={openMetarInfo}>
                            <p>More weather & ATIS</p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.metar ? 'open' : ''}`}>
                                <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                        <div className='info-panel-container sub'>
                            <div className='info-panel-flow-section'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M21.737 13.539c.061-.308.061-.554.061-.862 0-3.57-2.861-6.462-6.393-6.462-.852 0-1.644.185-2.375.493-.852-1.17-2.192-1.908-3.653-1.908-2.436 0-4.445 2.03-4.445 4.492 0 1.231.487 2.4 1.4 3.262-.852.8-1.4 1.907-1.4 3.138 0 2.339 1.888 4.247 4.201 4.247h1.34c.365 0 .609-.247.609-.616 0-.37-.244-.615-.61-.615H9.134c-1.644 0-2.983-1.354-2.983-3.016 0-1.6 1.278-2.892 2.8-3.015v.062c0 .43.062.922.122 1.353a.596.596 0 0 0 .61.493h.121a.64.64 0 0 0 .487-.739c-.06-.492-.06-.861-.06-1.17 0-2.891 2.313-5.23 5.175-5.23s5.176 2.339 5.176 5.23c0 .247 0 .493-.061.74-.914.123-1.705.615-2.253 1.353-.183.308-.122.677.122.862.243.184.67.123.852-.123a1.91 1.91 0 0 1 1.583-.862c1.096 0 1.948.923 1.948 1.97s-.791 1.969-1.887 1.969h-1.888c-.365 0-.608.246-.608.615 0 .37.243.615.608.615h1.827c1.766 0 3.166-1.415 3.166-3.2.122-1.476-.913-2.707-2.253-3.076ZM9.133 11.385c-.609 0-1.217.123-1.705.369-.73-.615-1.217-1.539-1.217-2.523 0-1.785 1.461-3.262 3.227-3.262.974 0 1.948.493 2.557 1.231-1.461.923-2.496 2.4-2.862 4.185m6.394 3.385c-.183-.309-.548-.431-.792-.247-.304.185-.426.554-.243.8l1.583 3.015h-2.618a.64.64 0 0 0-.549.308.56.56 0 0 0 0 .616l2.314 4.43a.64.64 0 0 0 .548.308c.122 0 .183 0 .305-.061.304-.185.426-.554.243-.862l-1.826-3.508h2.618a.72.72 0 0 0 .548-.307.56.56 0 0 0 0-.616zm-1.34-9.785a.55.55 0 0 0 .426-.185l1.34-1.354a.6.6 0 0 0 0-.861.584.584 0 0 0-.852 0l-1.34 1.353a.6.6 0 0 0 0 .862.55.55 0 0 0 .426.185M9.438 2.892c.365 0 .609-.246.609-.615V.615c0-.369-.244-.615-.61-.615-.365 0-.608.246-.608.615v1.723c0 .308.243.554.609.554M4.932 3.938 3.532 2.4a.584.584 0 0 0-.853 0 .664.664 0 0 0-.06.862l1.4 1.538a.69.69 0 0 0 .487.185.65.65 0 0 0 .426-.185c.183-.246.244-.615 0-.862M3.349 9.23c0-.368-.244-.615-.609-.615H.609c-.365 0-.609.247-.609.616s.244.615.609.615H2.74c.304 0 .609-.308.609-.615Zm.243 4.924-1.217 1.23a.6.6 0 0 0 0 .862.55.55 0 0 0 .426.185.55.55 0 0 0 .426-.185l1.218-1.23a.6.6 0 0 0 0-.862.584.584 0 0 0-.853 0" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <div className="info-panel-container-content" id='airport-panel-metar'>
                                <div className="info-panel-data">
                                    <p>AIR PRESSURE</p>
                                    <div className="info-panel-data-content">{data.weather.altimeters}</div>
                                </div>
                                <div className="info-panel-data">
                                    <p>DEW POINT</p>
                                    <div className="info-panel-data-content">{data.weather.dewPoint}</div>
                                </div>
                                <div className="info-panel-data">
                                    <p>HUMIDITY</p>
                                    <div className="info-panel-data-content">{'%'}</div>
                                </div>
                                <div className="info-panel-data">
                                    <p>LATEST METAR</p>
                                    <div className="info-panel-data-content" style={{ fontSize: '0.75rem' }}>{data.weather.raw}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {data.data &&
                    <div className="info-panel-container sub">
                        <div className='info-panel-flow-section'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M1.052 19.077c.546 0 .99-.44.99-.985a.987.987 0 0 0-.99-.984c-.547 0-.99.44-.99.984s.443.985.99.985m6.185-3.507-.371-1.17c.804-.246 1.237-.308 1.299-.308l.186 1.231c-.062-.062-.433.062-1.114.246ZM4.64 16.615l-.558-1.107c.248-.123.433-.185.68-.308l.496 1.108c-.186.123-.433.184-.619.307Zm1.236-.553-.433-1.17c.248-.123.495-.184.68-.246l.434 1.17c-.186.06-.433.122-.68.245Zm-2.969 1.415-.618-1.108c.37-.184.742-.43 1.113-.554l.557 1.108c-.31.185-.68.37-1.052.554M.99 12.246c.546 0 .99-.44.99-.985a.987.987 0 0 0-.99-.984c-.547 0-.99.44-.99.985 0 .543.443.984.99.984m6.247.924s-.31-.185-.99-.431l.433-1.17c.68.246 1.114.492 1.238.554zm-1.484-.555a1.2 1.2 0 0 0-.495-.123l.309-1.169.557.185zM4.7 12.308c-.186-.062-.31-.062-.495-.123l.248-1.231c.185.061.37.061.556.123zm-.989-.246a50 50 0 0 0-1.175-.185l.186-1.23c.433.06.866.122 1.237.184l-.248 1.23Zm19.237 9.353c.547 0 .99-.44.99-.984a.987.987 0 0 0-.99-.985c-.546 0-.99.441-.99.985s.444.984.99.984m-6.866-6.338c-.618-.37-.99-.492-.99-.492l.434-1.17c.062 0 .495.185 1.175.616zm3.464 2.523c-.309-.246-.556-.492-.804-.677l.804-.923c.248.246.557.492.866.738zm-1.67-1.354c-.309-.246-.618-.43-.866-.615l.68-1.046c.31.184.62.43.929.676zm3.34 2.954c-.309-.308-.618-.554-.866-.861l.866-.924c.31.247.62.554.928.862l-.927.923Zm-15.03 4.185c.546 0 .99-.441.99-.985a.987.987 0 0 0-.99-.985c-.547 0-.99.441-.99.985s.443.985.99.985m1.113-2.77-1.175-.369c0-.061.185-.492.618-1.23l1.052.676c-.371.616-.495.923-.495.923m.866-1.415-.99-.738c.124-.185.248-.308.371-.493l.99.739c-.185.184-.31.369-.371.492m.68-.923-.927-.739c.123-.123.247-.307.37-.492l.928.8c-.123.123-.247.308-.37.43Zm.743-.862-.928-.8c.247-.307.556-.615.866-.923l.866.862c-.248.308-.557.554-.804.861M16.33 24c.547 0 .99-.44.99-.985a.987.987 0 0 0-.99-.984c-.547 0-.99.44-.99.984s.443.985.99.985m-2.784-6.708c-.37-.554-.68-.923-.68-.923l.928-.8s.37.431.804 1.046zm1.299 2.216c-.062-.185-.185-.37-.247-.554l1.113-.554c.124.185.186.43.31.677zm-.618-1.108c-.124-.185-.248-.37-.31-.554l1.052-.677c.124.185.248.37.371.616zm1.051 2.77c-.062-.309-.123-.678-.247-1.047l1.175-.37c.124.493.248.924.31 1.355l-1.238.061Zm7.732-6.4c.547 0 .99-.442.99-.985a.987.987 0 0 0-.99-.985c-.546 0-.99.44-.99.985 0 .543.444.984.99.984Zm-5.814-1.97c-.68-.062-1.175 0-1.175 0l-.062-1.23h1.299zm2.412.308c-.185-.062-.37-.062-.618-.123l.247-1.231c.248.061.433.061.68.123zm-1.237-.185c-.185 0-.433-.062-.618-.062l.123-1.23c.186 0 .433.061.68.061zm2.845.8c-.309-.184-.68-.308-1.051-.43l.371-1.17c.433.123.866.308 1.237.492l-.556 1.108Zm-9.526.677-.432-.492c-.124-.185-3.65-4.123-4.763-7.262-.186-.37-.31-.861-.31-1.477v-.184C6.186 2.277 8.66 0 11.692 0c3.03 0 5.505 2.215 5.505 4.985v.184c0 .554-.124 1.046-.31 1.539-1.113 3.138-4.577 7.077-4.762 7.261l-.433.431Zm0-13.17c-2.35 0-4.267 1.662-4.267 3.755v.184c0 .431.123.739.247 1.046.804 2.277 3.093 5.17 4.083 6.339.99-1.17 3.278-4.062 4.02-6.277.124-.37.248-.8.248-1.17v-.122c0-2.093-1.918-3.754-4.33-3.754Zm.063 6.708a2.54 2.54 0 0 1-2.537-2.523c0-1.415 1.176-2.523 2.537-2.523a2.54 2.54 0 0 1 2.536 2.523c0 1.354-1.176 2.523-2.536 2.523m0-3.876c-.743 0-1.3.615-1.3 1.292 0 .738.62 1.292 1.3 1.292.742 0 1.299-.615 1.299-1.354 0-.615-.557-1.23-1.3-1.23Z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <div className="info-panel-container-content" id='airport-panel-flights'>
                            <div className="info-panel-data">
                                <p>DEPARTURES</p>
                                <div className="info-panel-data-content">{data.data.departures.n}</div>
                            </div>
                            <div className="info-panel-data">
                                <p>ARRIVALS</p>
                                <div className="info-panel-data-content">{data.data.arrivals.n}</div>
                            </div>
                            <div className="info-panel-data">
                                <p>BUSIEST ROUTE</p>
                                <div className="info-panel-data-content">{data.data.busiest ? data.data.busiest : '-'}</div>
                            </div>
                            <div className="info-panel-data">
                                <p>ACTIVE ROUTES</p>
                                <div className="info-panel-data-content">{data.data.connections}</div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}