import { getVatsimFlightData } from "@/storage/singleton/next/vatsim"
import { NextResponse } from "next/server"

export async function GET(request: Request, props: { params: Promise<{ callsign: string }> }) {
    const params = await props.params;
    const callsign = params.callsign
    const data = getVatsimFlightData(callsign)

    return NextResponse.json(data)
}