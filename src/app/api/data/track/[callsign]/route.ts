import { getVatsimTrackData } from "@/storage/vatsim"
import { NextResponse } from "next/server"

export async function GET(request: Request, props: { params: Promise<{ callsign: string }> }) {
    const params = await props.params;
    const callsign = params.callsign
    const track = getVatsimTrackData(callsign)

    return NextResponse.json(track)
}