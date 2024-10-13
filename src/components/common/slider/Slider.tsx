'use client'

import { useEffect, useState } from "react"
import "./Slider.css"
import { useSliderStore } from "@/storage/state/slider"
import { usePathname, useRouter } from "next/navigation"

export default function Slider({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    const pathname = usePathname()
    const { page } = useSliderStore()
    const [hide, setHide] = useState<string | null>(null)

    useEffect(() => {
        const type = page.split('/')[1]

        if (type === hide) {
            router.replace(page)
        } else {
            setHide(null)
            setTimeout(() => {
                router.replace(page)
            }, 300)
        }
    }, [page, router])

    useEffect(() => {
        const type = pathname.split('/')[1]
        setHide(type)
    }, [pathname])

    return (
        <div className={`slider ${hide === null ? 'hide' : ''}`}>
            {children}
        </div>
    )
}