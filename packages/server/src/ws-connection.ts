import { isResponseDataState, isServerEventDataState, lookupValue, response } from '@final-ui/react'
import { WebSocket } from 'ws'
import { z } from 'zod'

import { findModel, getModelState } from './model-utils'
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

export type WSServerContext = {
  models: AnyModels
  getModel: (key: string) => ValueModel<unknown> | (() => unknown) | undefined
  clientIdIndex: number
  clientSenders: Map<string, (value: any) => void>
  clientSubscribers: Map<string, Map<string, () => void>>
}

export function createWSServerContext(models: AnyModels): WSServerContext {
  function getModel(key: string) {
    const path = key.split('/')
    const model = findModel(models, path)
    return model
  }
  return {
    models,
    getModel,
    clientIdIndex: 0,
    clientSenders: new Map<string, (value: any) => void>(),
    clientSubscribers: new Map<string, Map<string, () => void>>(),
  }
}

export function connectWebSocket(context: WSServerContext, ws: WebSocket) {
  const clientId = `c${context.clientIdIndex}`
  context.clientIdIndex += 1
  // console.log(`Client ${clientId} connected`)

  const { clientSenders, clientSubscribers, models, getModel } = context

  clientSenders.set(clientId, function sendClient(value: any) {
    ws.send(JSON.stringify(value))
  })

  ws.addEventListener('close', function close() {
    clientSenders.delete(clientId)
    // console.log(`Client ${clientId} disconnected`)
  })

  function handleSubKey(key: string) {
    // console.log(`${clientId} sub to key ${key}`)
    async function send() {
      const sender = clientSenders.get(clientId)
      if (!sender) {
        return
      }
      const model = getModel(key) as ValueModel<unknown> | undefined
      const val = typeof model === 'function' ? model() : model?.get()
      // console.log('sending', model, key, val)
      sender({
        $: 'up',
        key,
        val,
      })
    }
    const handlers =
      clientSubscribers.get(key) ||
      (() => {
        const handlers = new Map<string, () => void>()
        clientSubscribers.set(key, handlers)
        const model = getModel(key)
        if (model && typeof model === 'object') {
          model.subscribe(() => {
            handlers.forEach((handler) => handler())
          })
        }

        return handlers
      })()
    handlers.set(clientId, send)
    send()
  }

  function handleUnsubKey(key: string) {
    const handlers = clientSubscribers.get(key)
    handlers?.delete(clientId)
  }

  function handleSub({ keys }: z.infer<typeof serverSubscribeMessageSchema>) {
    keys.forEach(handleSubKey)
  }

  function handleUnsub({ keys }: z.infer<typeof serverUnsubscribeMessageSchema>) {
    keys.forEach(handleUnsubKey)
  }

  async function handleEvt({ key, event }: z.infer<typeof serverEventMessageSchema>) {
    // console.log('handleEvt', key, event)
    const { target, payload } = event
    const { path } = target
    try {
      const [storeName, ...lookupPath] = path
      if (!storeName) throw new Error('Missing store name in event path')
      const model = findModel(models, storeName.split('/'))
      if (!model) throw new Error(`Model not found for store name: ${storeName}`)
      const modelState = getModelState(model)
      const value = lookupValue(modelState, lookupPath)

      if (!isServerEventDataState(value)) {
        throw new Error(`Missing event handler on the server for event: ${JSON.stringify(event)}`)
      }
      let res = await value.handler(...payload)
      if (!isResponseDataState(res)) {
        res = response(res ?? null)
      }
      clientSenders.get(clientId)?.({
        $: 'evt-res',
        key,
        res,
      })
    } catch (error: any) {
      clientSenders.get(clientId)?.({
        $: 'evt-res',
        key,
        res: response(error).status(500),
      })
      return
    }
  }

  // console.log('connected client', clientId)
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
        // @ts-ignore
        `Failed to validate message "${messageUnvalidated['$']}" from client ${clientId}: ${JSON.stringify(e.message)}`
      )
    }
    if (message.$ === 'sub') return handleSub(message)
    if (message.$ === 'unsub') return handleUnsub(message)
    if (message.$ === 'evt') return handleEvt(message)
  })
}
