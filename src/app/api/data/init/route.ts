import { getVatsimDataWs } from "@/storage/singletons/global"
import { VatsimDataWS } from "@/types/vatsim"
import { NextResponse } from "next/server"

export async function GET() {
    const data: VatsimDataWS | null = getVatsimDataWs()

    return NextResponse.json(data)
}