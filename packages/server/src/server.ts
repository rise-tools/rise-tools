// import Fastify from 'fastify'
// import http from 'http'
// import { WebSocket, WebSocketServer } from 'ws'

// import type { Model } from './models'

// export async function createServer(models: Record<string, Model<any>>) {
//   let nextClientId = 0

//   function handleWSConnection(ws: WebSocket) {
//     const clientId = nextClientId
//     console.log('new ws client', clientId)
//     nextClientId += 1
//     function handleSub(message: { keys: string[] }) {
//       console.log('sub', clientId, message)
//     }

//     function handleUnsub(message: { keys: string[] }) {
//       console.log('unsub', clientId, message)
//     }
//     ws.addEventListener('message', (event) => {
//       const message = JSON.parse(event.data.toString())
//       switch (message['$']) {
//         case 'sub':
//           handleSub(message)
//           break
//         case 'unsub':
//           handleUnsub(message)
//           break
//         default:
//           console.error('unknown message', message)
//       }
//     })
//     ws.addEventListener('close', () => {
//       console.log('ws client disconnected', clientId)
//     })
//   }

//   return {
//     handleWSConnection,
//     serve: async (port: number, enableWebsockets = true): Promise<void> => {
//       const fastify = Fastify()

//       fastify.post('/data', (request, reply) => {
//         const { body } = request
//         reply.send({ received: body })
//       })

//       fastify.get('/foo', (req, reply) => {
//         reply.send({ a: 1 })
//       })

//       const server = http.createServer((req, res) => {
//         fastify.ready((err) => {
//           if (err) {
//             res.statusCode = 500
//             res.end('Internal Server Error')
//             return
//           }
//           fastify.server.emit('request', req, res)
//         })
//       })
//       if (enableWebsockets) {
//         const wss = new WebSocketServer({ server })
//         wss.on('connection', (ws) => {
//           handleWSConnection(ws)
//         })
//       }
//       await new Promise<void>((resolve) => server.listen(port, resolve))
//     },
//   }
// }
