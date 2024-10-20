import { getVatsimTrackData } from "@/storage/singleton/next/vatsim"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: { callsign: string } }
) {
    const callsign = params.callsign
    const track = getVatsimTrackData(callsign)

    return NextResponse.json(track)
}