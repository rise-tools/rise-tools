import { WebSocketServer } from 'ws'

import { AnyModels } from './types'
import { connectWebSocket, createWSServerContext } from './ws-connection'

export function createWSServer(models: AnyModels, port: number) {
  const wss = new WebSocketServer({ port })
  const context = createWSServerContext(models)

  wss.on('connection', (ws) => {
    connectWebSocket(context, ws)
  })

  return {
    close() {
      wss.close()
    },
  }
}
