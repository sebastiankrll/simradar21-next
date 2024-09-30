import { getWsData } from "@/storage/singletons/global"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic' 

export async function GET() {
    const data = getWsData()
    return NextResponse.json(data)
}