import type { Metadata } from "next"
import Header from "@/components/header/Header"
import "./globals.css"
import dynamic from "next/dynamic"
import { Manrope } from 'next/font/google'
import Slider from "@/components/common/slider/Slider"
import '@/components/common/panel/Panel.css'

export const metadata: Metadata = {
    title: "simradar21",
    description: "VATSIM tracking service",
}

const manrope = Manrope({
    subsets: ['latin'],
    display: 'swap'
})

const Map = dynamic(() => import('@/components/map/MapLayer'), {
    ssr: false
})

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={manrope.className}>
            <body>
                <Header />
                <Map />
                <Slider>
                    {children}
                </Slider>
            </body>
        </html>
    )
}