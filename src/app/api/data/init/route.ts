import { getGlobalVatsimStorage } from "@/storage/singletons/global"
import { VatsimDataWS } from "@/types/vatsim"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic' 

export async function GET() {
    const vatsimDataStorage = getGlobalVatsimStorage()
    if (!vatsimDataStorage) return NextResponse.json(null)

    const data: VatsimDataWS = {
        position: vatsimDataStorage.position,
        timestamp: vatsimDataStorage.timestamp
    }

    return NextResponse.json(data)
}