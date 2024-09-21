import { getVatsimDataWs } from "@/storage/singletons/global"
import { VatsimDataWS } from "@/types/vatsim"

export const dynamic = 'force-dynamic'

export async function GET() {
    const data: VatsimDataWS | null = getVatsimDataWs()
    return Response.json({ data })
}