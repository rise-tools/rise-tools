import { Frame } from './eg-sacn'
import WebSocket from 'ws'

export function createEGViewServer(port: number) {
  const clientSenders = new Map<string, (value: Uint8Array) => void>()

  const wss = new WebSocket.Server({ port })
  let clientIdIndex = 0

  wss.on('listening', () => {
    console.log(`preview service listening on port ${port}`)
  })
  wss.on('connection', function connection(ws) {
    const clientId = `c${clientIdIndex}`
    clientIdIndex += 1
    console.log(`Image Client ${clientId} connected`)

    function sendClient(value: Uint8Array) {
      ws.send(value)
    }

    clientSenders.set(clientId, sendClient)

    ws.on('close', function close() {
      clientSenders.delete(clientId)
      console.log(`Image Client ${clientId} disconnected`)
    })
  })

  function sendFrame(frame: Frame) {
    clientSenders.forEach((sender) => {
      sender(frame)
    })
  }
  return {
    sendFrame,
  }
}
