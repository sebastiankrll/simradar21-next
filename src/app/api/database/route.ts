import { getDatabaseStorage } from "@/storage/database"
import { NextResponse } from "next/server"

export async function GET() {
    const data = getDatabaseStorage()
    return NextResponse.json(data)
}