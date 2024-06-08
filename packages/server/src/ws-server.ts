import { WebSocketServer } from 'ws'
import { z } from 'zod'

import { findModel } from './model-utils'
import { AnyModels, ValueModel } from './types'

const serverSubscribeMessageSchema = z.object({
  $: z.literal('sub'),
  keys: z.array(z.string()),
})
const serverUnsubscribeMessageSchema = z.object({
  $: z.literal('unsub'),
  keys: z.array(z.string()),
})
const serverEventMessageSchema = z.object({
  $: z.literal('evt'),
  event: z.object({
    target: z.object({
      key: z.string(),
      component: z.string(),
      propKey: z.string(),
      path: z.array(z.string()),
    }),
    dataState: z.any(),
    payload: z.any(),
  }),
  key: z.string(),
})

const serverMessageSchema = z.discriminatedUnion('$', [
  serverSubscribeMessageSchema,
  serverUnsubscribeMessageSchema,
  serverEventMessageSchema,
])

// type ServerMessage = z.infer<typeof serverMessageSchema>

export function createWSServer(models: AnyModels, port: number) {
  let clientIdIndex = 0
  const clientSenders = new Map<string, (value: any) => void>()
  const clientSubscribers = new Map<string, Map<string, () => void>>()

  const wss = new WebSocketServer({ port })

  function getModel(key: string) {
    const path = key.split('/')
    const model = findModel(models, path)
    return model
  }

  wss.on('connection', (ws) => {
    const clientId = `c${clientIdIndex}`
    clientIdIndex += 1
    console.log(`Client ${clientId} connected`)

    clientSenders.set(clientId, function sendClient(value: any) {
      ws.send(JSON.stringify(value))
    })

    ws.addEventListener('close', function close() {
      clientSenders.delete(clientId)
      console.log(`Client ${clientId} disconnected`)
    })

    function handleSubKey(key: string) {
      console.log(`${clientId} sub to key ${key}`)
      async function send() {
        const sender = clientSenders.get(clientId)
        if (!sender) {
          return
        }
        const model = getModel(key) as ValueModel<unknown> | undefined
        sender({
          $: 'up',
          key,
          val: model?.get(),
        })
      }
      const handlers =
        clientSubscribers.get(key) ||
        (() => {
          const handlers = new Map<string, () => void>()
          clientSubscribers.set(key, handlers)
          return handlers
        })()
      handlers.set(clientId, send)
      send()
    }

    function handleUnsubKey(key: string) {
      console.log(`${clientId} unsub from key ${key}`)
      const handlers = clientSubscribers.get(key)
      handlers?.delete(clientId)
    }

    function handleSub({ keys }: z.infer<typeof serverSubscribeMessageSchema>) {
      keys.forEach(handleSubKey)
    }

    function handleUnsub({ keys }: z.infer<typeof serverUnsubscribeMessageSchema>) {
      keys.forEach(handleUnsubKey)
    }

    function handleEvt({ key, event }: z.infer<typeof serverEventMessageSchema>) {
      console.log('client event', key, event.target.path)
    }

    console.log('connected client', clientId)
    ws.on('message', (messageData) => {
      let messageUnvalidated, message
      try {
        messageUnvalidated = JSON.parse(messageData.toString())
        // console.log(messageUnvalidated)
      } catch (e) {
        throw new Error('Failed to parse JSON from client ' + clientId)
      }
      try {
        message = serverMessageSchema.parse(messageUnvalidated)
      } catch (e) {
        throw new Error(
          `Failed to validate message "${messageUnvalidated['$']}" from client ${clientId}: ${JSON.stringify(e.message)}`
        )
      }
      if (message.$ === 'sub') return handleSub(message)
      if (message.$ === 'unsub') return handleUnsub(message)
      if (message.$ === 'evt') return handleEvt(message)
    })
  })
}
