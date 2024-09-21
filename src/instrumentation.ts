import { setGlobalVatsimStorage } from "./storage/singletons/global";
import { Redis } from "ioredis";

export async function register() {
    const redisSub = new Redis()

    redisSub.subscribe("vatsim_storage", (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message)
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`
            )
        }
    })

    redisSub.on("message", (channel, data) => {
        setGlobalVatsimStorage(JSON.parse(data))
    })
}