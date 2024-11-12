import globalThis from "@/storage/global"
import { unstable_cache } from "next/cache"
import { NextResponse } from "next/server"

const getVersions = unstable_cache(
    async () => {
        return await globalThis.redisGet.get('CLIENT_DB_VERSIONS')
    },
    ['CLIENT_DB_VERSIONS'],
    { revalidate: 3600, tags: ['CLIENT_DB_VERSIONS'] }
)

export async function GET() {
    const versions = await getVersions()
    if (!versions) { return NextResponse.json(null) }

    return new NextResponse(versions, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}