import globalThis from "@/storage/global";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ slug: string[] }> }
) {
    const params = await props.params

    if (params.slug[0] === 'airports') {
        const data = await globalThis.redisGet.get('CLIENT_DB_AIRPORTS')
        if (!data) { return NextResponse.json(null) }

        return new NextResponse(data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    if (params.slug[0] === 'firs') {
        const data = await globalThis.redisGet.get('CLIENT_DB_FIRS')
        if (!data) { return NextResponse.json(null) }

        return new NextResponse(data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    if (params.slug[0] === 'tracons') {
        const data = await globalThis.redisGet.get('CLIENT_DB_TRACONS')
        if (!data) { return NextResponse.json(null) }

        return new NextResponse(data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}