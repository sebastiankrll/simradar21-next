import Airport from "@/components/airport/Airport";

export default function Page({ params }: { params: { icao: string } }) {
    console.log(params.icao)
    return <Airport />
}