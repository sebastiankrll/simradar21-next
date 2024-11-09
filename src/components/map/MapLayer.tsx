'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./OlMap'), { ssr: false })

export default function MapLayer({ }) {
    return <Map />
}