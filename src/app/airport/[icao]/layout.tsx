import dynamic from 'next/dynamic';

const Airport = dynamic(() => import('@/components/airport/Airport'), {
    ssr: false
})

export default async function Layout({
    children,
    params
}: Readonly<{
    children: React.ReactNode,
    params: { icao: string }
}>) {
    return <Airport icao={params.icao} children={children} />
}