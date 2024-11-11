import { getDatabaseVersions } from "@/storage/database"
import { getVatsimWsData } from "@/storage/vatsim"
import { NextResponse } from "next/server"

export async function GET() {
    const vatsim = getVatsimWsData()
    const database = getDatabaseVersions()

    return NextResponse.json({
        vatsim: vatsim,
        database: database
    })
}