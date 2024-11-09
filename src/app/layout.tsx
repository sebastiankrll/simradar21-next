import type { Metadata } from "next"
import Header from "@/components/header/Header"
import "./globals.css"
import { Manrope } from 'next/font/google'
import Slider from "@/components/common/slider/Slider"
import '@/components/common/panel/Panel.css'
import MapLayer from "@/components/map/MapLayer"

export const metadata: Metadata = {
    title: "simradar21",
    description: "VATSIM tracking service",
}

const manrope = Manrope({
    subsets: ['latin'],
    display: 'swap'
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
                <MapLayer />
                <Slider>
                    {children}
                </Slider>
            </body>
        </html>
    )
}