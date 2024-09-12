import { VatsimDataStorage } from "@/types/data/vatsim";
import { createClient } from "redis";
import { vatsimDataStorage } from "@/server/storage/vatsim";

const redisSub = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect()
redisSub.subscribe('vatsim_storage', (data) => {
    receiveVatsimStorage(JSON.parse(data))
})

function receiveVatsimStorage(data: VatsimDataStorage) {
    Object.assign(vatsimDataStorage, data)
}