import { Redis } from "ioredis";

export async function subRedis(topic: string, callback: (data: string) => void) {
    const redisSub = new Redis()

    redisSub.subscribe(topic, (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message)
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`
            )
        }
    })

    redisSub.on("message", (channel, data) => {
        callback(data)
    })
}