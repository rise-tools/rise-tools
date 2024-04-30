import { createWSServerDataSource } from '@final-ui/ws-server'

import { getInventoryExample } from './inventory/ui'
import { UIContext } from './types'

function setupDataSource() {
  const dataSource = createWSServerDataSource()

  const ctx: UIContext = {
    update: (key, updater) => {
      dataSource.update(key, updater(dataSource.get(key)))
    },
  }
  for (const [key, value] of Object.entries(getInventoryExample(ctx))) {
    dataSource.update(key, value)
  }

  return dataSource
}

export default {
  async fetch(request: Request): Promise<Response> {
    const upgrade = request.headers.get('Upgrade')
    if (!upgrade || upgrade !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 })
    }

    const webSocketPair = new WebSocketPair()
    const [client, server] = Object.values(webSocketPair) as [WebSocket, WebSocket]

    server.accept()

    setupDataSource().handleWSConnection(server)

    return new Response(null, {
      status: 101,
      webSocket: client,
    })
  },
}
