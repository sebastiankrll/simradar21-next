// import dynamic from 'next/dynamic';

import Flight from "@/components/flight/Flight";

// const Flight = dynamic(() => import('@/components/flight/Flight'), {
//     ssr: false
// })

export default async function Page({ params }: { params: { callsign: string } }) {
    return <Flight callsign={params.callsign} />
}