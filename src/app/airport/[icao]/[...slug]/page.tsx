export default async function Page({ params }: { params: { slug: string[] } }) {
    return <div>{params.slug[0]}</div>
}