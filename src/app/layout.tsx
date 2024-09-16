import type { Metadata } from "next"
import Header from "@/components/header/Header"
import "./globals.css"
import dynamic from "next/dynamic"
import { getGlobalVatsimStorage } from "@/storage/global"

export const metadata: Metadata = {
    title: "simradar21",
    description: "VATSIM tracking service",
}

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
        <html lang="en">
            <body>
                <Header />
                <Map vatsimData={vatsimData} />
                {children}
            </body>
        </html>
    )
}