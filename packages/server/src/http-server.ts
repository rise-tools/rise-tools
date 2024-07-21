import Fastify from 'fastify'

import { findModel } from './model-utils'
import { AnyModels, Server } from './types'

export async function createHTTPServer(models: AnyModels, port: number): Promise<Server> {
  const server = Fastify({
    // logger: true,
  })
  server.get('*', async function handler(request, reply) {
    const path = request.url.split('/').filter(Boolean)
    const resp = await handleGetRequest(models, { path })
    if (!resp) return reply.code(404).send({ error: 'not found' })
    return resp
  })
  await server.listen({ port })
  return {
    port,
    protocol: 'http',
    close() {
      server.close()
    },
  }
}

export function handlePostRequest() {
  // todo, handle events
}

export async function handleGetRequest(models: AnyModels, req: { path: string[] }) {
  const model = findModel(models, req.path)
  if (!model) return undefined
  if (typeof model === 'function') return model()
  if (model.type === 'state') return model.get()
  return await model.load()
}
