import { getGlobalVatsimStorage } from "@/storage/singletons/global";
import { FlightData } from "@/types/flight";
import dynamic from "next/dynamic";

const Flight = dynamic(() => import('@/components/flight/Flight'), {
    ssr: false
})

export default async function Page({ params }: { params: { callsign: string } }) {
    const vatsimDataStorage = getGlobalVatsimStorage()
    const callsign = params.callsign

    const position = vatsimDataStorage.position?.find(pilot => pilot.callsign === callsign) ?? null
    const general = vatsimDataStorage.general?.find(pilot => pilot.index.callsign === callsign) ?? null
    const status = vatsimDataStorage.status?.find(pilot => pilot.index.callsign === callsign) ?? null
    const track = vatsimDataStorage.track?.find(pilot => pilot.callsign === callsign) ?? null

    const data: FlightData = {
        position: position,
        general: general,
        status: status,
        track: track
    }

    return <Flight data={data} />
}