import { Redis } from "ioredis";
import { setVatsimStorage } from "./storage/singletons/vatsim";

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

    redisSub.subscribe("database_storage", (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message)
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`
            )
        }
    })

    redisSub.on("message", (channel, data) => {
        if (channel === 'vatsim_storage') setVatsimStorage(JSON.parse(data))
        if (channel === 'database_storage') setVatsimStorage(JSON.parse(data))
    })
}