import { getVatsimWsData, setVatsimStorage } from "@/storage/singleton/vatsim";
import { subRedis } from "@/utils/redis";
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

subRedis('vatsim_storage', sendWsData)