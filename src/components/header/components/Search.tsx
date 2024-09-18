'use client'

import { useEffect, useState } from "react"

export const Search = () => {
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        const resetInput = () => {
            setSearchValue('')
        }

        document.addEventListener('click', resetInput)

        return () => {
            document.removeEventListener('click', resetInput)
        }
    }, [])

    return (
        <input
            className="header-search"
            type="text"
            placeholder="Not available yet."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)} />
    )
}