import { Redis } from "ioredis";
import { setVatsimStorage } from "./storage/singletons/vatsim";
import { setDatabaseStorage } from "./storage/singletons/database";

export async function register() {
    const redisSub = new Redis()
    const redisGet = new Redis()

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

    redisGet.get('database_storage', (err, result) => {
        if (err || !result) {
            console.log(`Error getting redis database_storage data: ${err}`)
        } else {
            setDatabaseStorage(JSON.parse(result))
        }
    })
}