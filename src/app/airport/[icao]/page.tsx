import dynamic from 'next/dynamic';

const Airport = dynamic(() => import('@/components/airport/Airport'), {
    ssr: false
})

export default async function Page({ params }: { params: { icao: string } }) {
    return <Airport icao={params.icao} />
}