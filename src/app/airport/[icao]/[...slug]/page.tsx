import dynamic from 'next/dynamic';

const AirportFlights = dynamic(() => import('@/components/airport/components/AirportFlights'), {
    ssr: false
})

export default async function Page({ params }: { params: { icao: string, slug: string[] } }) {
    return <AirportFlights icao={params.icao} direction={params.slug[0]} />
}