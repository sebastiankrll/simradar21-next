import { getDatabaseStorage } from "@/storage/singleton/next/database"
import { NextResponse } from "next/server"

export async function GET() {
    const data = getDatabaseStorage()
    return NextResponse.json(data)
}