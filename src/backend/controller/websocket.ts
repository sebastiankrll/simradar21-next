import { getVatsimWsData, setVatsimStorage } from "@/storage/backend/vatsim";
import Redis from "ioredis";
import { WebSocket, WebSocketServer } from "ws";
import { createGzip } from "zlib";

const wss = new WebSocketServer({
    port: 8080,
    perMessageDeflate: false
})

wss.on('connection', function connection(ws) {
    console.log('A new client connected!')
    ws.on('error', console.error)
    ws.on('message', async msg => {
        console.log(msg)
    })
})

function sendWsData(data: string) {
    setVatsimStorage(JSON.parse(data))

    const gzip = createGzip()
    const storage = getVatsimWsData()

    gzip.write(JSON.stringify({
        event: 'set_vatsim',
        data: storage,
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
}

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
    sendWsData(data)
})