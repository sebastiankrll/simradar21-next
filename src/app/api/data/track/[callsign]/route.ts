import { getTrackData } from "@/storage/singletons/global"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: { callsign: string } }
) {
    const callsign = params.callsign
    const track = getTrackData(callsign)

    return NextResponse.json(track)
}