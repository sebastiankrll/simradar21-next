import { getFlightData } from "@/storage/singletons/global"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: { callsign: string } }
) {
    const callsign = params.callsign
    const data = getFlightData(callsign)

    return NextResponse.json(data)
}