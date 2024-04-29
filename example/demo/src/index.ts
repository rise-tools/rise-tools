import { createWSDataSource } from '@final-ui/ws-server'

import { getInventoryExample } from './inventory/ui'
import { UIContext } from './types'

export default {
  async fetch(request: Request): Promise<Response> {
    const upgrade = request.headers.get('Upgrade')
    if (!upgrade || upgrade !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 })
    }

    const webSocketPair = new WebSocketPair()
    const [client, server] = Object.values(webSocketPair) as [WebSocket, WebSocket]

    // Accepts the WebSocket connection and begins terminating requests
    // for the WebSocket on Cloudflare’s global network.
    server.accept()

    const dataSource = createWSDataSource()

    dataSource.handleWSConnection(server)

    const ctx: UIContext = {
      update: (key, updater) => {
        dataSource.update(key, updater(dataSource.get(key)))
      },
    }

    for (const [key, value] of Object.entries(getInventoryExample(ctx))) {
      dataSource.update(key, value)
    }

    return new Response(null, {
      status: 101,
      webSocket: client,
    })
  },
}
