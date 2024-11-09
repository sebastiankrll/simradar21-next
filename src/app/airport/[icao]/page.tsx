import MainInfo from "@/components/airport/components/MainInfo";

export default async function Page(props: { params: Promise<{ icao: string }> }) {
    const params = await props.params;
    return <MainInfo icao={params.icao} />
}