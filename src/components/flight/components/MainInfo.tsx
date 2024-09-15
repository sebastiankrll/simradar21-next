'use client'

import { StatusData } from "@/types/data/vatsim"

export default function MainInfo({ status }: { status: StatusData | undefined }) {
    if (!status) return
    return (
        <div className="info-panel-container column main scrollable">
            <div className={`info-panel-container column sub dropdown ${panelStates.more ? 'open' : ''}`} style={{ display: dataRef.current.route?.general.flightplan ? '' : 'none' }}>
                <button className='info-panel-container-header' onClick={openMoreInfo}>
                    <p>More {dataRef.current.route?.general.general.flightno ?? dataRef.current.route?.general.general.callsign} information</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.more ? 'open' : ''}`}>
                        <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                    </svg>
                </button>
                <div className='info-panel-container sub'>
                    <div className='info-panel-flow-section'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                d="M16.824 13.162h-.798v4.132h.798zm-.648-1.771c-.1 0-.15.05-.2.098-.05.05-.05.148-.1.197-.05.098-.05.148-.05.246 0 .05.05.098.05.197 0 .098.05.148.1.197s.15.049.2.098c.05.05.1.05.2.05.099 0 .149-.05.249-.05s.15-.05.2-.098c.05-.05.099-.148.149-.197s.05-.098.05-.197c0-.098 0-.197-.05-.246-.05-.05-.1-.098-.15-.197-.05-.049-.1-.049-.2-.098-.1-.05-.149-.05-.249-.05-.05 0-.15 0-.2.05Zm7.682-5.608a.7.7 0 0 0-.15-.197c-1.496-1.082-2.095-.935-4.29-.246L14.33 7.111c-.948-.344-2.045-.738-3.143-1.131-1.646-.64-3.392-1.23-5.138-1.87-.499-.197-.798-.098-1.147.05l-.699.295c-.1.049-.499.196-.548.54-.05.197 0 .394.2.542C5.2 6.668 7.046 8.292 8.542 9.522L5.8 10.604a37 37 0 0 1-1.647-.443 95 95 0 0 1-1.845-.443c-.1-.049-.2 0-.3 0l-1.696.64c-.15.05-.299.197-.299.393-.05.197.05.345.2.443 1.346 1.033 1.995 1.525 2.594 1.919.449.344.848.64 1.596 1.18l.05.05c.25.147.548.196.798.196.3 0 .648-.098.998-.246l4.689-1.77a5.1 5.1 0 0 0-.3 1.77c0 3.149 2.595 5.707 5.787 5.707 3.193 0 5.787-2.558 5.787-5.707 0-2.115-1.148-3.935-2.893-4.919l2.793-1.033c.649-.295 2.395-.984 1.746-2.558m-2.694 8.51c0 2.608-2.145 4.723-4.789 4.723s-4.789-2.115-4.789-4.723 2.145-4.722 4.79-4.722c2.643 0 4.788 2.164 4.788 4.722m-3.242-5.46c-.5-.148-.998-.197-1.547-.197-2.045 0-3.84 1.082-4.889 2.657L5.8 13.457c-.5.246-.749.148-.898.098a11 11 0 0 0-1.547-1.18c-.449-.345-.948-.689-1.845-1.378l.698-.295 1.646.443c.549.148 1.098.295 1.746.443.15.049.3.049.4 0l3.341-1.28c.2-.098.4-.294.4-.491.05-.246-.05-.443-.2-.59C8.194 8.045 6.348 6.52 4.901 5.29l.4-.197c.25-.098.3-.098.449-.05 1.696.64 3.492 1.28 5.088 1.821 1.197.443 2.295.836 3.243 1.18.05 0 .1.05.15.05h.099c.05 0 .1 0 .15-.05l5.238-1.77c2.045-.64 2.294-.689 3.242 0 .1.295 0 .64-1.297 1.131z"
                                clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <div className="info-panel-container-content">
                        <div className="info-panel-data-separator">
                            {dataRef.current.route?.general.general.flightno ?? dataRef.current.route?.general.general.callsign + ' FLIGHT FROM ' + dataRef.current.route?.general.airports?.iata[0] + ' TO ' + dataRef.current.route?.general.airports?.iata[1]}
                        </div>
                        <div className="info-panel-container sub" id='aircraft-panel-more'>
                            <div className="info-panel-data">
                                <p>GREAT CIRCLE DISTANCE</p>
                                <div className="info-panel-data-content">{Utils.convertLengthUnit(dataRef.current.route?.general.flightplan?.dist).toLocaleString() + ' km'}</div>
                            </div>
                            <div className="info-panel-data">
                                <p>ENROUTE TIME</p>
                                <div className="info-panel-data-content">{Utils.getEnrouteTime(dataRef.current.route?.general.flightplan?.enroute)}</div>
                            </div>
                            <div className="info-panel-data">
                                <figure id="aircraft-panel-more-airline">
                                    <img src={'https://images.kiwi.com/airlines/64/' + dataRef.current.route?.general.airline?.iata + '.png'} alt="" />
                                </figure>
                            </div>
                        </div>
                        <div className="info-panel-data-separator">
                            {'ADDITIONAL FLIGHTPLAN INFORMATION'}
                        </div>
                        <div className="info-panel-container sub column">
                            <div className="info-panel-data">
                                <p>FLIGHT PLAN</p>
                                <div className="info-panel-data-content" style={{ fontSize: '0.75rem' }}>{dataRef.current.route?.general.flightplan?.plan}</div>
                            </div>
                            <div className="info-panel-data">
                                <p>REMARKS</p>
                                <div className="info-panel-data-content" style={{ fontSize: '0.75rem' }}>{dataRef.current.route?.general.flightplan?.remarks}</div>
                            </div>
                            <div className="info-panel-data">
                                <p>FLIGHT RULES</p>
                                <div className="info-panel-data-content">{dataRef.current.route?.general.flightplan?.rules}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="info-panel-container sub" style={{ display: dataRef.current.route?.general.flightplan ? '' : 'none' }}>
                <div className='info-panel-flow-section'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="m7.066 24-.06-.823s-.122-1.203-.122-1.457c-.061-.38-.061-.633 3.106-3.356-.061-.886-.122-3.546-.122-4.876-1.157.317-4.142 1.837-6.7 3.23l-.73.38-.184-.887c0-.063-.182-.95-.243-1.836-.061-.38-.122-1.204 7.735-7.093 0-.886-.06-3.356 0-4.432.061-1.71 1.95-2.66 2.01-2.723L12 0l.305.127c.182.126 1.949 1.14 2.01 2.723.06 1.14 0 3.546 0 4.432 7.796 5.89 7.735 6.713 7.674 7.093a18 18 0 0 1-.243 1.836l-.183.823-.731-.38c-2.497-1.393-5.543-2.913-6.7-3.23 0 1.33-.061 3.99-.122 4.877 3.167 2.723 3.106 2.976 3.106 3.356-.06.253-.121 1.456-.121 1.456l-.061.824-.731-.254s-3.655-1.203-4.325-1.456c-.548.063-2.497.76-4.08 1.393zM12 20.96c.122 0 .122 0 3.898 1.267 0-.19.061-.38.061-.507-.365-.443-1.705-1.646-2.863-2.66l-.243-.19v-.316c.06-1.583.183-4.813.122-5.636 0-.316.121-.57.304-.696.305-.19.975-.634 7.431 2.913.061-.254.061-.507.122-.76-.487-.76-4.142-3.736-7.492-6.206l-.244-.19v-.317c0-.063.122-3.42.061-4.686 0-.633-.67-1.203-1.096-1.52-.427.317-1.036.824-1.097 1.457-.06 1.33.061 4.686.061 4.686v.317l-.243.19c-3.411 2.533-7.066 5.446-7.553 6.269 0 .253.06.506.122.76 6.456-3.547 7.126-3.103 7.43-2.913.244.126.366.443.305.696-.06.823.061 4.053.122 5.636v.317l-.244.19c-1.157 1.013-2.497 2.216-2.862 2.66 0 .126 0 .316.06.443C9.32 21.72 11.27 20.96 12 20.96" clipRule="evenodd"></path>
                    </svg>
                </div>
                <div className="info-panel-container-content" id='aircraft-panel-ac'>
                    <div className="info-panel-data">
                        <p>AIRCRAFT TYPE</p>
                        <div className="info-panel-data-content">{dataRef.current.route?.general.aircraft?.type}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>REGISTRATION</p>
                        <div className="info-panel-data-content">{dataRef.current.route?.general.aircraft?.registration}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>COUNTRY OF REG.</p>
                        <div className="info-panel-data-content">
                            <div className={'fflag ff-ac fflag-' + dataRef.current.route?.general.aircraft?.country} style={{ display: dataRef.current.route?.general.aircraft?.country ? '' : 'none' }}></div>
                        </div>
                    </div>
                    <div className="info-panel-data">
                        <p>SERIAL NUMBER (MSN)</p>
                        <div className="info-panel-data-content">{dataRef.current.route?.general.aircraft?.msn}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>AGE</p>
                        <div className="info-panel-data-content">{dataRef.current.route?.general.aircraft?.age}</div>
                    </div>
                </div>
            </div>
            <div className={`info-panel-container column sub dropdown ${panelStates.graph ? 'open' : ''}`}>
                <button className='info-panel-container-header' onClick={openGraphInfo}>
                    <p>Speed & Altitude graph</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.graph ? 'open' : ''}`}>
                        <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                    </svg>
                </button>
                <div className='info-panel-container sub'>
                    <div className='info-panel-flow-section'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                d="M21.125 24H2.858A2.867 2.867 0 0 1 0 21.14V2.86A2.867 2.867 0 0 1 2.858 0h18.267a2.867 2.867 0 0 1 2.858 2.86v18.28A2.867 2.867 0 0 1 21.125 24M2.875 1.168c-.947 0-1.725.761-1.725 1.726v18.28c0 .947.761 1.726 1.725 1.726h18.267c.947 0 1.725-.762 1.725-1.726V2.86c0-.947-.761-1.726-1.725-1.726zm3.417 14.826a.58.58 0 0 1-.575-.575V.575A.58.58 0 0 1 6.292 0a.57.57 0 0 1 .575.575v14.86a.567.567 0 0 1-.575.56ZM12.008 24a.58.58 0 0 1-.575-.576V9.715a.58.58 0 0 1 .575-.575.57.57 0 0 1 .576.575v13.71a.57.57 0 0 1-.575.575Zm5.7-13.71a.58.58 0 0 1-.575-.575V.575c0-.304.254-.575.575-.575a.58.58 0 0 1 .575.575v9.14a.57.57 0 0 1-.575.576Zm5.7 7.99H8.575A.58.58 0 0 1 8 17.703a.57.57 0 0 1 .575-.576h14.85c.304 0 .575.254.575.576s-.27.575-.592.575ZM7.442 12.574H.592A.58.58 0 0 1 .017 12a.58.58 0 0 1 .575-.575h6.85a.58.58 0 0 1 .575.575c-.017.322-.27.575-.575.575Zm2.283-5.703H.592a.567.567 0 0 1-.575-.559.58.58 0 0 1 .575-.575h9.133a.58.58 0 0 1 .575.575c0 .322-.27.559-.575.559M4.026 18.28H.592a.58.58 0 0 1-.575-.576.57.57 0 0 1 .575-.576H4.01c.304 0 .575.254.575.576a.567.567 0 0 1-.558.575ZM6.292 24a.58.58 0 0 1-.575-.576v-3.418c0-.305.254-.576.575-.576a.57.57 0 0 1 .575.576v3.418a.56.56 0 0 1-.575.576M12.01 4.587a.58.58 0 0 1-.575-.576V.575A.58.58 0 0 1 12.01 0a.57.57 0 0 1 .575.575v3.436c0 .322-.27.576-.575.576m11.4 2.285h-9.134a.58.58 0 0 1-.575-.576.57.57 0 0 1 .575-.575h9.133a.58.58 0 0 1 .575.575.57.57 0 0 1-.575.576Zm0 5.704h-3.417a.58.58 0 0 1-.575-.576.58.58 0 0 1 .575-.575h3.416a.58.58 0 0 1 .575.575.57.57 0 0 1-.575.575ZM17.708 24a.58.58 0 0 1-.575-.576v-9.14a.58.58 0 0 1 .575-.575c.304 0 .575.254.575.576v9.14a.56.56 0 0 1-.575.575M2.876 21.732a.583.583 0 0 1-.389-1.015l3.907-3.352L11.467 6.06a.56.56 0 0 1 .423-.321.53.53 0 0 1 .508.169l5.294 5.297 3.044-3.012c.22-.22.592-.22.812 0s.22.592 0 .812l-3.433 3.42a.58.58 0 0 1-.812 0l-5.108-5.13-4.787 10.664a.6.6 0 0 1-.152.203L3.231 21.58a.56.56 0 0 1-.355.152m12.55-9.156h-3.417a.58.58 0 0 1-.575-.576.58.58 0 0 1 .575-.575h3.416A.58.58 0 0 1 16 12a.57.57 0 0 1-.575.575Z"
                                clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <div className="info-panel-container-content" id='aircraft-panel-graph'>
                        <Graph param={dataRef.current.graph} />
                    </div>
                </div>
            </div>
            <div className="info-panel-container sub">
                <div className='info-panel-flow-section'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M23.114 7.134c-.854-.547-2.778-.712-5.206-.859-.805-.053-1.803-.111-2.088-.194 0 0-.006-.006-.012-.006-.145-.1-.593-.417-1.205-.852-4.872-3.474-5.847-4.097-6.24-4.185-.327-.047-1.145-.124-1.605.3-.484.47-.29 1.034-.2 1.287.061.14.176.294 1.441 1.863A96 96 0 0 1 9.422 6.27c-1.162.065-3.487.071-3.88.006h-.006c-.34-.147-2.252-1.34-3.94-2.427a.6.6 0 0 0-.322-.095H.608a.62.62 0 0 0-.508.27.57.57 0 0 0-.042.571c2.724 5.608 2.76 5.626 2.966 5.75.2.117 5.181.146 9.975.146 4.486 0 8.807-.023 8.892-.03a.4.4 0 0 0 .085-.01c1.598-.295 1.943-1.112 2.01-1.576.102-.723-.364-1.464-.872-1.74Zm-1.308 2.151c-1.41.041-15.756.024-18.098-.023A344 344 0 0 1 1.777 5.37c2.379 1.523 3.087 1.905 3.341 2.005.109.053.375.153 2.724.117 2.488-.03 2.633-.153 2.803-.288a.6.6 0 0 0 .084-.082c.255-.306.164-.63.115-.823l-.018-.065c-.048-.194-.12-.305-1.87-2.475a83 83 0 0 1-1.26-1.581c.116-.012.28-.012.424.006.63.311 4.22 2.869 5.775 3.98.563.4.987.705 1.174.834.31.277.926.33 2.76.441 1.496.094 4.002.253 4.625.676a1 1 0 0 1 .079.047c.097.053.296.335.254.565-.042.24-.405.447-.98.558Zm-7.602 6.173a.61.61 0 0 0 .854-.006.57.57 0 0 0-.007-.829l-2.578-2.48a.61.61 0 0 0-.842-.007l-2.675 2.481a.574.574 0 0 0-.018.829c.23.235.61.241.853.018l1.604-1.488v7.072l-1.592-1.534a.61.61 0 0 0-.853.006.57.57 0 0 0 .006.829l2.578 2.48a.615.615 0 0 0 .842.006l2.675-2.48a.574.574 0 0 0 .018-.83.616.616 0 0 0-.853-.017l-1.604 1.487v-7.072z" clipRule="evenodd"></path>
                    </svg>
                </div>
                <div className="info-panel-container-content" id='aircraft-panel-lnav'>
                    <div className="info-panel-data">
                        <p>BAROMETRIC ALT.</p>
                        <div className="info-panel-data-content">{liveData?.alt.toLocaleString() + ' ft'}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>VERTICAL SPEED</p>
                        <div className="info-panel-data-content">{liveData?.fpm > 0 ? '+' + liveData?.fpm + ' fpm' : liveData?.fpm + ' fpm'}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>RADAR ALT.</p>
                        <div className="info-panel-data-content">{liveData?.rdr.toLocaleString() + ' ft'}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>TRACK</p>
                        <div className="info-panel-data-content">{liveData?.hdg + '°'}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>ALTIMETER</p>
                        <div className="info-panel-data-content">{dataRef.current.route?.status.misc.altimeters + ' hPa'}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>GROUND SPEED</p>
                        <div className="info-panel-data-content">{liveData?.spd + ' kts'}</div>
                    </div>
                </div>
            </div>
            <div className={`info-panel-container column sub dropdown ${panelStates.pilot ? 'open' : ''}`}>
                <button className='info-panel-container-header' onClick={openPilotInfo}>
                    <p>Pilot information</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.pilot ? 'open' : ''}`}>
                        <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                    </svg>
                </button>
                <div className='info-panel-container sub'>
                    <div className='info-panel-flow-section'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                d="M21.125 24H2.858A2.867 2.867 0 0 1 0 21.14V2.86A2.867 2.867 0 0 1 2.858 0h18.267a2.867 2.867 0 0 1 2.858 2.86v18.28A2.867 2.867 0 0 1 21.125 24M2.875 1.168c-.947 0-1.725.761-1.725 1.726v18.28c0 .947.761 1.726 1.725 1.726h18.267c.947 0 1.725-.762 1.725-1.726V2.86c0-.947-.761-1.726-1.725-1.726zm3.417 14.826a.58.58 0 0 1-.575-.575V.575A.58.58 0 0 1 6.292 0a.57.57 0 0 1 .575.575v14.86a.567.567 0 0 1-.575.56ZM12.008 24a.58.58 0 0 1-.575-.576V9.715a.58.58 0 0 1 .575-.575.57.57 0 0 1 .576.575v13.71a.57.57 0 0 1-.575.575Zm5.7-13.71a.58.58 0 0 1-.575-.575V.575c0-.304.254-.575.575-.575a.58.58 0 0 1 .575.575v9.14a.57.57 0 0 1-.575.576Zm5.7 7.99H8.575A.58.58 0 0 1 8 17.703a.57.57 0 0 1 .575-.576h14.85c.304 0 .575.254.575.576s-.27.575-.592.575ZM7.442 12.574H.592A.58.58 0 0 1 .017 12a.58.58 0 0 1 .575-.575h6.85a.58.58 0 0 1 .575.575c-.017.322-.27.575-.575.575Zm2.283-5.703H.592a.567.567 0 0 1-.575-.559.58.58 0 0 1 .575-.575h9.133a.58.58 0 0 1 .575.575c0 .322-.27.559-.575.559M4.026 18.28H.592a.58.58 0 0 1-.575-.576.57.57 0 0 1 .575-.576H4.01c.304 0 .575.254.575.576a.567.567 0 0 1-.558.575ZM6.292 24a.58.58 0 0 1-.575-.576v-3.418c0-.305.254-.576.575-.576a.57.57 0 0 1 .575.576v3.418a.56.56 0 0 1-.575.576M12.01 4.587a.58.58 0 0 1-.575-.576V.575A.58.58 0 0 1 12.01 0a.57.57 0 0 1 .575.575v3.436c0 .322-.27.576-.575.576m11.4 2.285h-9.134a.58.58 0 0 1-.575-.576.57.57 0 0 1 .575-.575h9.133a.58.58 0 0 1 .575.575.57.57 0 0 1-.575.576Zm0 5.704h-3.417a.58.58 0 0 1-.575-.576.58.58 0 0 1 .575-.575h3.416a.58.58 0 0 1 .575.575.57.57 0 0 1-.575.575ZM17.708 24a.58.58 0 0 1-.575-.576v-9.14a.58.58 0 0 1 .575-.575c.304 0 .575.254.575.576v9.14a.56.56 0 0 1-.575.575M2.876 21.732a.583.583 0 0 1-.389-1.015l3.907-3.352L11.467 6.06a.56.56 0 0 1 .423-.321.53.53 0 0 1 .508.169l5.294 5.297 3.044-3.012c.22-.22.592-.22.812 0s.22.592 0 .812l-3.433 3.42a.58.58 0 0 1-.812 0l-5.108-5.13-4.787 10.664a.6.6 0 0 1-.152.203L3.231 21.58a.56.56 0 0 1-.355.152m12.55-9.156h-3.417a.58.58 0 0 1-.575-.576.58.58 0 0 1 .575-.575h3.416A.58.58 0 0 1 16 12a.57.57 0 0 1-.575.575Z"
                                clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <div className="info-panel-container-content" id='aircraft-panel-pilot'>
                        <div className="info-panel-data">
                            <p>PILOT'S NAME</p>
                            <div className="info-panel-data-content">{dataRef.current.route?.general.general.name}</div>
                        </div>
                        <div className="info-panel-data">
                            <p>VATSIM ID</p>
                            <div className="info-panel-data-content">{dataRef.current.route?.general.general.cid}</div>
                        </div>
                        <div className="info-panel-data">
                            <p>RATING</p>
                            <div className="info-panel-data-content">{dataRef.current.route?.general.general.rating}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="info-panel-container sub">
                <div className='info-panel-flow-section'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M23.114 7.134c-.854-.547-2.778-.712-5.206-.859-.805-.053-1.803-.111-2.088-.194 0 0-.006-.006-.012-.006-.145-.1-.593-.417-1.205-.852-4.872-3.474-5.847-4.097-6.24-4.185-.327-.047-1.145-.124-1.605.3-.484.47-.29 1.034-.2 1.287.061.14.176.294 1.441 1.863A96 96 0 0 1 9.422 6.27c-1.162.065-3.487.071-3.88.006h-.006c-.34-.147-2.252-1.34-3.94-2.427a.6.6 0 0 0-.322-.095H.608a.62.62 0 0 0-.508.27.57.57 0 0 0-.042.571c2.724 5.608 2.76 5.626 2.966 5.75.2.117 5.181.146 9.975.146 4.486 0 8.807-.023 8.892-.03a.4.4 0 0 0 .085-.01c1.598-.295 1.943-1.112 2.01-1.576.102-.723-.364-1.464-.872-1.74Zm-1.308 2.151c-1.41.041-15.756.024-18.098-.023A344 344 0 0 1 1.777 5.37c2.379 1.523 3.087 1.905 3.341 2.005.109.053.375.153 2.724.117 2.488-.03 2.633-.153 2.803-.288a.6.6 0 0 0 .084-.082c.255-.306.164-.63.115-.823l-.018-.065c-.048-.194-.12-.305-1.87-2.475a83 83 0 0 1-1.26-1.581c.116-.012.28-.012.424.006.63.311 4.22 2.869 5.775 3.98.563.4.987.705 1.174.834.31.277.926.33 2.76.441 1.496.094 4.002.253 4.625.676a1 1 0 0 1 .079.047c.097.053.296.335.254.565-.042.24-.405.447-.98.558Zm-7.602 6.173a.61.61 0 0 0 .854-.006.57.57 0 0 0-.007-.829l-2.578-2.48a.61.61 0 0 0-.842-.007l-2.675 2.481a.574.574 0 0 0-.018.829c.23.235.61.241.853.018l1.604-1.488v7.072l-1.592-1.534a.61.61 0 0 0-.853.006.57.57 0 0 0 .006.829l2.578 2.48a.615.615 0 0 0 .842.006l2.675-2.48a.574.574 0 0 0 .018-.83.616.616 0 0 0-.853-.017l-1.604 1.487v-7.072z" clipRule="evenodd"></path>
                    </svg>
                </div>
                <div className="info-panel-container-content" id='aircraft-panel-position'>
                    <div className="info-panel-data">
                        <p>SERVER</p>
                        <div className="info-panel-data-content">{dataRef.current.route?.general.general.server}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>SQUAWK</p>
                        <div className="info-panel-data-content">{dataRef.current.route?.status.misc.transponder}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>LATITUDE</p>
                        <div className="info-panel-data-content">{dataRef.current.route?.position.co[1]}</div>
                    </div>
                    <div className="info-panel-data">
                        <p>LONGITUDE</p>
                        <div className="info-panel-data-content">{dataRef.current.route?.position.co[0]}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}