import { WebSocketServer } from 'ws'

import { AnyModels } from './types'

export function createWSServer(models: AnyModels, port: number) {
  if (models.type === 'state') {
  }
  const wss = new WebSocketServer({ port })
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const { type, key } = JSON.parse(message.toString())
      const model = models[type](key)
      ws.send(JSON.stringify(model.get()))
    })
  })
}
