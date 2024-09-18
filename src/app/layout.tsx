import type { Metadata } from "next"
import Header from "@/components/header/Header"
import "./globals.css"
import dynamic from "next/dynamic"
import { getGlobalVatsimStorage } from "@/storage/global"
import { Manrope } from 'next/font/google'

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

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const vatsimData = getGlobalVatsimStorage()
    return (
        <html lang="en" className={manrope.className}>
            <body>
                <Header />
                <Map vatsimData={vatsimData} />
                {children}
            </body>
        </html>
    )
}