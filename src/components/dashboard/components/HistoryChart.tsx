import Chart from "@/components/common/chart/Chart";
import { PanelStates } from "@/types/misc";

export default function HistoryChart(
    {
        panelStates,
        clickOpen
    }:
        {
            panelStates: PanelStates,
            clickOpen: (e: React.MouseEvent<HTMLElement>) => void
        }
) {
    return (
        <div className={`info-panel-container column overview dropdown ${panelStates.chart ? 'open' : ''}`}>
            <div className="info-panel-container-header" onClick={clickOpen} data-name="chart">
                <p>Last 24 hours</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.chart ? 'open' : ''}`}>
                    <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                </svg>
            </div>
            <div className="info-panel-container-content">
                <Chart param={null} />
            </div>
        </div>
    )
}