import { createClient } from "redis";

export async function subRedis(topic: string, callback: (data: string) => void) {
    const redisSub = await createClient()
        .on('error', err => console.log('Redis Client Error', err))
        .connect()

    redisSub.subscribe(topic, (data: string) => {
        callback(data)
    })
}