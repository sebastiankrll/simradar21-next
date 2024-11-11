import Airport from "@/components/airport/Airport";

export default async function Layout(
    props: Readonly<{
        children: React.ReactNode,
        params: { icao: string }
    }>
) {
    const params = await props.params

    const {
        children
    } = props

    return <Airport icao={params.icao}>
        {children}
    </Airport>
}