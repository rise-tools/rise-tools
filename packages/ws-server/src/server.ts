import WS from 'ws'

import { createWSServerDataSource } from './data-source'

export function createWSServer(port: number) {
  const dataSource = createWSServerDataSource()
  const wss = new WS.Server({ port })

  wss.on('connection', dataSource.handleWSConnection)
  wss.on('listening', () => {
    console.log(`WebSocket server started on port ${port}`)
  })

  return {
    ...dataSource,
    wss,
  }
}
