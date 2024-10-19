'use client'

import './Airport.css'

export default function Airport({ icao }: { icao: string }) {

    return (
        <div className='info-panel'>
            {icao}
        </div>
    )
}