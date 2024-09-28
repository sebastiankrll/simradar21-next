import dynamic from 'next/dynamic';

const Flight = dynamic(() => import('@/components/flight/Flight'), {
    ssr: false
})

export default async function Page({ params }: { params: { callsign: string } }) {
    return <Flight callsign={params.callsign} />
}