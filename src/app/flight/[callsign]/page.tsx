import Flight from "@/components/flight/Flight";
import { getGlobalVatsimStorage } from "@/storage/global";
import { FlightData } from "@/types/data/vatsim";

export default async function Page({ params }: { params: { callsign: string } }) {
    const vatsimDataStorage = getGlobalVatsimStorage()
    const callsign = params.callsign

    const position = vatsimDataStorage.position?.find(pilot => pilot.callsign === callsign) ?? null
    const general = vatsimDataStorage.general?.find(pilot => pilot.index.callsign === callsign) ?? null
    const status = vatsimDataStorage.status?.find(pilot => pilot.index.callsign === callsign) ?? null

    const data: FlightData = {
        position: position,
        general: general,
        status: status
    }

    return <Flight data={data} />
}