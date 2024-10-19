import dynamic from 'next/dynamic';

const MainInfo = dynamic(() => import('@/components/airport/components/MainInfo'), {
    ssr: false
})

export default async function Page({ params }: { params: { icao: string } }) {
    return <MainInfo icao={params.icao} />
}