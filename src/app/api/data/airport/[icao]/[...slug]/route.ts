import { AirportPanelFlightsSearchParams } from "@/types/panel";
import { getAirportFlights } from "@/utils/api/airport";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ icao: string, slug: string[] }> }
) {
    const params = await props.params
    if (params.slug[0] !== 'departure' && params.slug[0] !== 'arrival') { return NextResponse.json(null) }

    const searchParams = request.nextUrl.searchParams
    const pagination = searchParams.get('p')
    const timestamp = searchParams.get('t')
    const n = searchParams.get('n')

    const flightSearchParams: AirportPanelFlightsSearchParams = {
        icao: params.icao,
        direction: params.slug[0],
        pagination: pagination ? pagination : 'next',
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        n: n ? parseInt(n) : 10
    }

    const flights = (await getAirportFlights(flightSearchParams)) ?? null

    return NextResponse.json(flights)
}