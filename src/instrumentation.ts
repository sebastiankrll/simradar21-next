import { Redis } from "ioredis";
import { setVatsimStorage } from "./storage/singleton/vatsim";
import { setDatabaseStorage } from "./storage/singleton/database";

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
        if (channel === 'database_storage') setDatabaseStorage(JSON.parse(data))
    })
}