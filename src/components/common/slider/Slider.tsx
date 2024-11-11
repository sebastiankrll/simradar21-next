'use client'

import { useEffect, useRef, useState } from "react"
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
    const [isSliding, setIsSliding] = useState<boolean>(false)

    const currentTypeRef = useRef<string | null>(null)

    useEffect(() => {
        const type = page.split('/')[1]

        if (type === currentTypeRef.current) {
            router.replace(page)
            return
        }

        setIsSliding(true)
        currentTypeRef.current = type

        setTimeout(() => {
            router.replace(page)
        }, 300)
    }, [page, router])

    useEffect(() => {
        setIsSliding(false)
    }, [pathname])

    return (
        <div className={`slider ${isSliding ? 'hide' : ''}`}>
            {children}
        </div>
    )
}