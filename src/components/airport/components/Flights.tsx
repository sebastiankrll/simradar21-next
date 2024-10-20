export default function Flights({ }) {
    const { data, isLoading } = useSWR<AirportAPIData | null>(`/api/data/airport/${icao}`, fetcher, {
        refreshInterval: 20000
    })
    
    return (
        <>
            <div className="info-panel-container column">
                {storedFlights ? <DelayBoard /> : null}
            </div>
            <div className="info-panel-container column main scrollable" ref={listRef}>
                <button className="flights-page-pagination" onClick={() => getFurtherData('before')}>{storedFlights?.length > 0 ? 'Load earlier flights' : 'No flights found'}</button>
                <div className="flights-page-wrapper">
                    {storedFlights ? renderFlights() : 'No flights'}
                </div>
                <button className="flights-page-pagination" onClick={() => getFurtherData('after')}>{storedFlights?.length > 0 ? 'Load later flights' : 'No flights found'}</button>
            </div>
        </>
    )
}