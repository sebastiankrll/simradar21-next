import AirportFlights from "@/components/airport/components/AirportFlights";

export default async function Page(props: { params: Promise<{ icao: string, slug: string[] }> }) {
    const params = await props.params;
    return <AirportFlights icao={params.icao} direction={params.slug[0]} />
}