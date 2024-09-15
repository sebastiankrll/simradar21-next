import { createClient } from "redis";
import { setGlobalVatsimStorage } from "./storage/global";

export async function register() {
    const redisSub = await createClient()
        .on('error', err => console.log('Redis Client Error', err))
        .connect()

    redisSub.subscribe('vatsim_storage', (data: string) => {
        setGlobalVatsimStorage(JSON.parse(data))
    })
}