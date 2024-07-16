import { type AnyModels, createServer, type CreateServerOptions } from '@rise-tools/server'

import { ConnectionPayload, createAppConnectionURL } from './connection'
import { getHost } from './getHost'
import { printQR } from './printQR'
import { connectTunnel, getTunnelAddress } from './tunnel'

const createCLIServer = async (models: AnyModels, options: CreateServerOptions) => {
  const server = await createServer(models, options)
  const { ws, port } = options

  return {
    get appConnectionURL() {
      const host = getHost()
      const appConnectionURL = createAppConnectionURL({
        host: `${ws ? 'ws' : 'http'}://${host}:${port}`,
        id: 'cli',
        label: 'CLI',
        path: '',
      })
      return appConnectionURL
    },
    connectTunnel() {
      connectTunnel()
    },
    printQR() {
      return printQR(this.appConnectionURL)
    },
    close() {
      server.close()
    },
  }
}

export {
  ConnectionPayload,
  connectTunnel,
  createAppConnectionURL,
  createCLIServer as createServer,
  getHost,
  getTunnelAddress,
  printQR,
}
