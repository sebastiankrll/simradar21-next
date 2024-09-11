import Aircraft from "@/components/aircraft/Aircraft";

export default function Page({ params }: { params: { slug: string } }) {
    return <Aircraft />
}