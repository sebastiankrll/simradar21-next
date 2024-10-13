import { getDatabaseVersions } from "@/storage/singletons/database"
import { getVatsimWsData } from "@/storage/singletons/vatsim"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
    const vatsim = getVatsimWsData()
    const database = getDatabaseVersions()

    return NextResponse.json({
        vatsim: vatsim,
        database: database
    })
}