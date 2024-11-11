import { getFrequencyColor, getOnlineTime } from "@/components/map/components/overlays";
import { VatsimStorageControllerIndex } from "@/types/vatsim";

export default function ActiveController({ station }: { station: VatsimStorageControllerIndex }) {
    return (
        <div className="info-panel-data">
            <div className="info-panel-controller-header">
                <p>{station.callsign}</p>
                <span className={`popup-content-box frequency ${getFrequencyColor(station.facility)}`}>{station.frequency}</span>
            </div>
            <div className="info-panel-controller-info">
                <p>Active connections: {station.connections}</p>
                <p>Online for: {getOnlineTime(station.logon)} h</p>
            </div>
            <div className="info-panel-data-content" style={{ fontSize: '.625rem' }}>{station.text?.join(' ')}</div>
        </div>
    )
}