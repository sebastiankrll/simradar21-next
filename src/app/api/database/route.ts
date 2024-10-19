import { getDatabaseStorage } from "@/storage/singletons/database"
import { DatabaseDataStorage } from "@/types/database"
import { NextResponse } from "next/server"

export async function GET() {
    const data: DatabaseDataStorage = getDatabaseStorage()
    return NextResponse.json(data)
}