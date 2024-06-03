import { createHTTPDataSource } from '@final-ui/http-server'
import Fastify from 'fastify'

import { models } from './ui'

function setupDataSource() {
  const dataSource = createHTTPDataSource()
  for (const [key, model] of Object.entries(models)) {
    dataSource.update(key, model)
  }
  return dataSource
}

const dataSource = setupDataSource()
const fastify = Fastify({
  logger: true,
})

fastify.get('*', async function handler(request, reply) {
  const res = await dataSource.handleRequest({
    path: request.url,
    method: request.method,
    body: request.body,
  })
  reply.send(JSON.stringify(res))
})

async function start() {
  try {
    await fastify.listen({ port: Number(process.env.PORT || '3000') })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
