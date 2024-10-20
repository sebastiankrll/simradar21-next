import { getVatsimAirportData } from "@/storage/singleton/next/vatsim"
import { AirportAPIData } from "@/types/vatsim"
import { getAirportTimezone, getAirportWeather } from "@/utils/api/airport"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: { icao: string } }
) {
    const airport: AirportAPIData = {
        data: getVatsimAirportData(params.icao),
        weather: await getAirportWeather(params.icao),
        timezone: await getAirportTimezone(params.icao)
    }

    return NextResponse.json(airport)
}