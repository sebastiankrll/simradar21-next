import { getVatsimAirportData } from "@/storage/singleton/next/vatsim"
import { AirportAPIData } from "@/types/vatsim"
import { getAirportWeather } from "@/utils/api/airport"
import { NextResponse } from "next/server"

export async function GET(request: Request, props: { params: Promise<{ icao: string }> }) {
    const params = await props.params;
    const airport: AirportAPIData = {
        data: getVatsimAirportData(params.icao),
        weather: await getAirportWeather(params.icao),
        timezone: null//await getAirportTimezone(params.icao)
    }

    return NextResponse.json(airport)
}