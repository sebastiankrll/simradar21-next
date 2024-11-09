import { getDatabaseVersions } from "@/storage/singleton/next/database"
import { getVatsimWsData } from "@/storage/singleton/next/vatsim"
import { NextResponse } from "next/server"

export async function GET() {
    const vatsim = getVatsimWsData()
    const database = getDatabaseVersions()

    return NextResponse.json({
        vatsim: vatsim,
        database: database
    })
}