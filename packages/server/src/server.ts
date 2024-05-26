import Fastify from 'fastify'
import http from 'http'
import { WebSocketServer } from 'ws'

import type { Model } from './models'

export async function createServer(models: Record<string, Model<any>>, port: number) {
  const fastify = Fastify()

  fastify.post('/data', (request, reply) => {
    const { body } = request
    reply.send({ received: body })
  })

  fastify.get('/foo', (req, reply) => {
    reply.send({ a: 1 })
  })

  const server = http.createServer((req, res) => {
    fastify.ready((err) => {
      if (err) {
        res.statusCode = 500
        res.end('Internal Server Error')
        return
      }
      fastify.server.emit('request', req, res)
    })
  })
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    console.log('ws client connected')
    ws.on('close', () => {})
    ws.on('message', () => {})
  })

  await new Promise<void>((resolve) => server.listen(port, resolve))
}
