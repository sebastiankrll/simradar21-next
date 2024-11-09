import Flight from "@/components/flight/Flight";

export default async function Page(props: { params: Promise<{ callsign: string }> }) {
    const params = await props.params;
    return <Flight callsign={params.callsign} />
}