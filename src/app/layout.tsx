import type { Metadata } from "next"

import Header from "@/components/header/Header"

import "./globals.css"
import MapLayer from "@/components/map/MapLayer"

export const metadata: Metadata = {
    title: "simradar21",
    description: "VATSIM tracking service",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <Header />
                <MapLayer />
                {children}
            </body>
        </html>
    );
}
