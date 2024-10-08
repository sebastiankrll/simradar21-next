import { PanelStates } from "@/types/misc"

export default function GeneralStats(
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
        <div className={`info-panel-container column overview dropdown ${panelStates.stats ? 'open' : ''}`}>
            <div className="info-panel-container-header" onClick={clickOpen} data-name="stats">
                <p>General statistics</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={`info-panel-header-dropdown ${panelStates.stats ? 'open' : ''}`}>
                    <path fillRule="evenodd" d="M11.842 18 .237 7.26a.686.686 0 0 1 0-1.038.8.8 0 0 1 1.105 0L11.842 16l10.816-9.704a.8.8 0 0 1 1.105 0 .686.686 0 0 1 0 1.037z" clipRule="evenodd"></path>
                </svg>
            </div>
            <div className="info-panel-container-content" id="overview-panel-stats">
                {/* <div className="overview-list">
                    <div></div><div>Total</div><div>View</div>
                    <div className="main left">Pilots</div><div className="main">{overviewStats?.pilots?.tot}</div><div className="main">{overviewStats?.pilotsExtent?.tot}</div>
                    <div className="left">Commercial</div><div>{overviewStats?.pilots?.com}</div><div>{overviewStats?.pilotsExtent?.com}</div>
                    <div className="left">Cargo</div><div>{overviewStats?.pilots?.car}</div><div>{overviewStats?.pilotsExtent?.car}</div>
                    <div className="left">Military</div><div>{overviewStats?.pilots?.mil}</div><div>{overviewStats?.pilotsExtent?.mil}</div>
                    <div className="left">General</div><div>{overviewStats?.pilots?.gen}</div><div>{overviewStats?.pilotsExtent?.gen}</div>
                    <div className="left">Helicopters</div><div>{overviewStats?.pilots?.hel}</div><div>{overviewStats?.pilotsExtent?.hel}</div>
                    <div className="left">Business</div><div>{overviewStats?.pilots?.bus}</div><div>{overviewStats?.pilotsExtent?.bus}</div>
                    <div className="left">Others</div><div>{overviewStats?.pilots?.etc}</div><div>{overviewStats?.pilotsExtent?.etc}</div>
                </div>
                <div className="overview-list">
                    <div></div><div>Total</div><div>View</div>
                    <div className="main left">Controllers</div><div className="main">{overviewStats?.controllers?.tot}</div><div className="main">{overviewStats?.controllersExtent?.tot}</div>
                    <div className="left">Sectors</div><div>{overviewStats?.controllers?.sec}</div><div>{overviewStats?.controllersExtent?.sec}</div>
                    <div className="left">Airports</div><div>{overviewStats?.controllers?.apt}</div><div>{overviewStats?.controllersExtent?.apt}</div>
                    <div className="left">Observers</div><div>-</div><div>-</div>
                </div> */}
            </div>
        </div>
    )
}