import { getGlobalVatsimStorage } from "@/storage/singletons/global"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: { callsign: string } }
) {
    const vatsimDataStorage = getGlobalVatsimStorage()
    const callsign = params.callsign
    const track = vatsimDataStorage?.track?.find(pilot => pilot.callsign === callsign) ?? null

    return NextResponse.json(track)
}