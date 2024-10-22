import { FlightsSearchParam } from "@/types/panel";
import { getAirportFlights } from "@/utils/api/airport";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { icao: string, slug: string[] } }
) {
    if (params.slug[0] !== 'departure' && params.slug[0] !== 'arrival') return NextResponse.json(null)

    const searchParams = request.nextUrl.searchParams
    const pagination = searchParams.get('p')
    const timestamp = searchParams.get('t')
    const n = searchParams.get('n')

    const flightSearchParams: FlightsSearchParam = {
        icao: params.icao,
        direction: params.slug[0],
        pagination: pagination ? pagination : 'next',
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        n: n ? parseInt(n) : 10
    }

    const flights = await getAirportFlights(flightSearchParams) ?? null

    return NextResponse.json(flights)
}