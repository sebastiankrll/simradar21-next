import { getVatsimWsData } from "@/storage/singletons/vatsim"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic' 

export async function GET() {
    const data = getVatsimWsData()
    return NextResponse.json(data)
}