import { getVatsimFlightData } from "@/storage/singletons/vatsim"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: { callsign: string } }
) {
    const callsign = params.callsign
    const data = getVatsimFlightData(callsign)

    return NextResponse.json(data)
}