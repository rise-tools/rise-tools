import fastifyWebsocket from '@fastify/websocket'
import Fastify from 'fastify'

import { handleGetRequest } from './http-server'
import { AnyModels } from './types'
import { connectWebSocket, createWSServerContext } from './ws-connection'

export interface CreateServerOptions {
  port: number
  host?: string
  /**
   * Enable websocket server
   */
  ws?: boolean
}

// tbd: what should we do for `createServer` that ultimately supports both HTTP and WS,
// in terms of generating connection string?
export async function createServer(models: AnyModels, port: number) {
  const server = Fastify()
  server.register(fastifyWebsocket)

  server.get('*', async function handler(request, reply) {
    const path = request.url.split('/').filter(Boolean)
    const resp = await handleGetRequest(models, { path })
    if (!resp) return reply.code(404).send({ error: 'not found' })
    return resp
  })

  const wsContext = createWSServerContext(models)
  server.get('/', { websocket: true }, (connection) => {
    connectWebSocket(wsContext, connection)
  })

  await server.listen({ port })

  return {
    close() {
      server.close()
    },
  }
}
