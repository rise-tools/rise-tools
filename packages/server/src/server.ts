import fastifyWebsocket from '@fastify/websocket'
import Fastify from 'fastify'

import { handleGetRequest } from './http-server'
import { AnyModels } from './types'
import { connectWebSocket, createWSServerContext } from './ws-connection'

export async function createServer(models: AnyModels, port: number) {
  const server = Fastify({
    // logger: true,
  })
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
