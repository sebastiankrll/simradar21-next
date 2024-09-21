import { getVatsimStorage } from "@/storage/singletons/vatsim"
import { FlightData } from "@/types/flight"

export async function GET(
    request: Request,
    { params }: { params: { callsign: string } }
) {
    const vatsimDataStorage = getVatsimStorage()
    const callsign = params.callsign

    const position = vatsimDataStorage.position?.find(pilot => pilot.callsign === callsign) ?? null
    const general = vatsimDataStorage.general?.find(pilot => pilot.index.callsign === callsign) ?? null
    const status = vatsimDataStorage.status?.find(pilot => pilot.index.callsign === callsign) ?? null

    const data: FlightData = {
        position: position,
        general: general,
        status: status
    }

    return Response.json({ data })
}