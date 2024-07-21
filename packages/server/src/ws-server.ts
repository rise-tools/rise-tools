import { WebSocketServer } from 'ws'

import { AnyModels, Server } from './types'
import { connectWebSocket, createWSServerContext } from './ws-connection'

export function createWSServer(models: AnyModels, port: number): Server {
  const wss = new WebSocketServer({ port })
  const context = createWSServerContext(models)

  wss.on('connection', (ws) => {
    connectWebSocket(context, ws)
  })

  return {
    port,
    protocol: 'ws',
    close() {
      wss.close()
    },
  }
}
