import { useAirport } from "@/utils/api/api"

export default function Delayboard({ icao, direction }: { icao: string, direction: string }) {
    const { airport } = useAirport(icao)

    if (!airport?.data) return

    const delay = direction === 'departure' ? airport.data.departures.tDelay : airport.data.arrivals.tDelay

    return (
        <div className="info-panel-container column">
            <div className="airport-flights-delayboard">
                <div className="airport-flights-delayboard-header">
                    CURRENT DISRUPTIONS
                </div>
                <div className="airport-flights-delayboard-main">
                    <div className="airport-flights-delayboard-element">
                        <div className="airport-flights-delayboard-title">
                            AVERAGE DELAY
                        </div>
                        <div className="airport-flights-delayboard-content" style={{ color: getDelayColor(delay) }}>
                            {delay}
                            <span>min</span>
                        </div>
                    </div>
                    <div className="airport-flights-delayboard-element">
                        <figure className="airport-flights-delayboard-icon">
                            {direction === 'departure' ?
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M.061 15.706a.6.6 0 0 0-.06.272c0 .1.026.197.077.281a.5.5 0 0 0 .212.197c1.206.63 1.911.98 2.473 1.257l.504.25v.001l.356.175c.412.201.843.412 1.523.762l.015.008.016.005c.32.098.66.112.99.041.326-.07.633-.22.892-.438l15.21-9.694a6 6 0 0 0 1.089-.84c.333-.27.556-.658.622-1.084a1.67 1.67 0 0 0-.27-1.202.53.53 0 0 0-.206-.206l-.009-.005c-.84-.407-1.439-.567-2.106-.447-.648.117-1.343.496-2.382 1.086l-.003.002-4.922 2.92q-.722-.118-1.522-.236l-.072-.01c-.583-.089-1.189-.18-1.806-.284h-.002l-1.113-.176h-.003c-1.45-.228-2.965-.467-4.461-.713a1.5 1.5 0 0 0-.638.027 1.6 1.6 0 0 0-.575.28l-.683.45a.91.91 0 0 0-.497.737v.019a.66.66 0 0 0 .337.574l5.422 3.199-2.565 1.652-1.726-.1-1.982-.11h-.003a.6.6 0 0 0-.322.083l-.006.004L.25 15.49l-.005.003a.6.6 0 0 0-.184.213m4.037-.111 1.831.107a.7.7 0 0 0 .443-.114l3.226-2.041.004-.003a.78.78 0 0 0 .257-1.007.7.7 0 0 0-.255-.268l-.002-.001-5.399-3.21.296-.174.009-.005c.126-.083.193-.12.247-.137a.35.35 0 0 1 .173-.004c.95.147 1.903.3 2.84.451l.056.01c.918.147 1.821.293 2.694.428 1.268.196 2.465.382 3.524.556l.01.001a.6.6 0 0 0 .228-.017l.077-.015a.6.6 0 0 0 .171-.056l.012-.007 5.02-2.987c.987-.537 1.522-.824 1.966-.915.405-.083.743-.005 1.325.267a.5.5 0 0 1 .05.151c.007.062 0 .14-.052.244-.11.223-.414.55-1.144 1.022L6.457 17.578l-.009.006c-.266.19-.463.268-.6.296a.53.53 0 0 1-.248 0c-.803-.42-1.235-.63-1.772-.893l-.18-.087c-.496-.243-1.055-.516-1.997-.996l.627-.423z" clipRule="evenodd"></path>
                                </svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M.384 7.883a.55.55 0 0 0-.23.145.52.52 0 0 0-.126.534c.416 1.286.673 2.025.877 2.613.065.187.125.359.182.528v.001l.131.372c.152.43.31.879.548 1.6l.005.017.008.014c.157.294.388.544.67.728.279.181.6.293.933.326l17.424 4.04c.44.113.893.176 1.348.188a1.7 1.7 0 0 0 1.188-.31c.34-.247.57-.612.64-1.02a.53.53 0 0 0-.004-.287l-.003-.01c-.312-.875-.623-1.407-1.177-1.796-.538-.376-1.29-.605-2.43-.93l-.004-.001-5.49-1.456c-.283-.394-.59-.808-.91-1.237l-.043-.059a115 115 0 0 1-1.08-1.47l-.665-.908-.002-.002c-.864-1.18-1.769-2.415-2.655-3.64a1.6 1.6 0 0 0-.468-.431 1.6 1.6 0 0 0-.6-.212l-.792-.173a.9.9 0 0 0-.86.16l-.007.005-.006.007a.64.64 0 0 0-.158.634l1.617 6.034-2.951-.669-1.149-1.286-1.322-1.475-.002-.003a.6.6 0 0 0-.284-.169l-.008-.002-1.862-.416-.006-.001a.56.56 0 0 0-.277.017m2.926 2.772 1.217 1.366c.1.12.239.201.392.233l3.685.867.005.001a.77.77 0 0 0 .69-.2.72.72 0 0 0 .192-.679v-.002L7.895 6.216l.33.088.01.003c.146.031.219.053.268.08a.34.34 0 0 1 .125.119c.57.772 1.136 1.55 1.693 2.315l.033.046c.545.75 1.082 1.488 1.605 2.197.76 1.03 1.475 2.003 2.102 2.87l.006.008q.073.09.173.149l.065.044a.6.6 0 0 0 .16.082l.012.003 5.606 1.481c1.066.325 1.642.505 2.018.755.343.228.527.52.75 1.119a.5.5 0 0 1-.07.14.4.4 0 0 1-.204.132c-.231.075-.671.087-1.512-.102l-17.46-4.057-.01-.002c-.32-.056-.512-.142-.628-.219a.54.54 0 0 1-.175-.175c-.277-.856-.436-1.306-.634-1.867l-.067-.187c-.182-.518-.388-1.1-.721-2.097l.734.151z" clipRule="evenodd"></path>
                                </svg>}
                        </figure>
                        <div className="airport-flights-delayboard-separator"></div>
                    </div>
                    <div className="airport-flights-delayboard-element">
                        <div className="airport-flights-delayboard-title">
                            FLIGHTS DELAYED
                        </div>
                        <div className="airport-flights-delayboard-content">
                            {direction === 'departure' ? airport.data.departures.nDelay : airport.data.arrivals.nDelay}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getDelayColor(delay: number) {
    if (delay <= 30) return 'rgb(11, 211, 167)'
    if (delay > 30) return 'rgb(234, 89, 121)'

    return "rgb(77, 95, 131)"
}