const WS_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080'
const socket = new WebSocket(WS_URL)

socket.addEventListener("open", (event) => {
    socket.send("Hello Server!")
})

async function decompressBlob(blob: Blob) {
    const ds = new DecompressionStream('gzip')
    const decompressedStream = blob.stream().pipeThrough(ds)
    return await new Response(decompressedStream).blob()
}

export function onMessage(callback: (message: any) => void) {
    const messageListener = async (event: MessageEvent) => {
        const decompressedData = await (await decompressBlob(event.data)).text()
        callback(JSON.parse(decompressedData))
    }
    socket.addEventListener("message", messageListener)

    return () => {
        socket.removeEventListener("message", messageListener)
    }
}