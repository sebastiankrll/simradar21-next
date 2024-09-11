import Airport from "@/components/airport/Airport";

export default function Page({ params }: { params: { slug: string } }) {
    return <Airport />
}