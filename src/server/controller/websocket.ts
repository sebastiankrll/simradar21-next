import { VatsimDataStorage } from "@/types/data/vatsim";
import { createClient } from "redis";
import { vatsimDataStorage } from "@/server/storage/vatsim";
import { WebSocketServer } from "ws";
import { createGzip } from "zlib";

const redisSub = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect()

const wss = new WebSocketServer({
    port: 8080,
    perMessageDeflate: false
})

wss.on('connection', function connection(ws) {
    ws.on('error', console.error)
    ws.on('message', async msg => {
        console.log(msg)
    })
})

redisSub.subscribe('vatsim_storage', (data) => {
    receiveVatsimStorage(JSON.parse(data))

    const gzip = createGzip()
    gzip.write(JSON.stringify({
        event: 'set_vatsim',
        data: vatsimDataStorage.position,
    }))
    gzip.end()

    const chunks: Buffer[] = []
    gzip.on('data', chunk => {
        chunks.push(chunk)
    })

    gzip.on('end', () => {
        const compressedData = Buffer.concat(chunks)

        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(compressedData)
            }
        })
    })
})

function receiveVatsimStorage(data: VatsimDataStorage) {
    Object.assign(vatsimDataStorage, data)
}