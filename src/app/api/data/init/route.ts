import { getVatsimWsData } from "@/storage/vatsim"
import { NextResponse } from "next/server"

export async function GET() {
    const data = getVatsimWsData()
    return NextResponse.json(data)
}