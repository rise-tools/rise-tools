import {
  errorResponse,
  isEventResponse,
  isServerEventModelState,
  lookupValue,
  response,
} from '@rise-tools/react'
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
  key: z.string(),
  target: z.object({
    key: z.string().optional(),
    component: z.string(),
    propKey: z.string(),
    path: z.array(z.string().or(z.number())),
  }),
  modelState: z.any(),
  payload: z.any(),
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

  const { clientSenders, clientSubscribers, getModel } = context

  clientSenders.set(clientId, function sendClient(value: any) {
    ws.send(JSON.stringify(value))
  })

  ws.addEventListener('close', function close() {
    clientSenders.delete(clientId)
  })

  function handleSubKey(key: string) {
    async function send() {
      const sender = clientSenders.get(clientId)
      if (!sender) {
        return
      }
      const model = getModel(key)
      if (!model) return
      const val = getModelState(model)
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

  async function handleEvt({ key, target, payload }: z.infer<typeof serverEventMessageSchema>) {
    const { path } = target
    try {
      const [storeName, ...lookupPath] = path
      if (!storeName) throw new Error('Missing store name in event path')
      if (typeof storeName !== 'string') throw new Error('Store name must be a string')
      const model = getModel(storeName)
      if (!model) throw new Error(`Model not found for store name: ${storeName}`)
      const modelState = getModelState(model)
      const value = lookupValue(modelState, lookupPath)

      if (!isServerEventModelState(value)) {
        throw new Error(`Missing event handler on the server for target: ${JSON.stringify(target)}`)
      }
      let res = await value.handler(...payload)
      if (isEventResponse(res)) {
        res = { ...res, key }
      } else {
        res = response(res, { key })
      }
      clientSenders.get(clientId)?.(res)
    } catch (error: any) {
      clientSenders.get(clientId)?.(errorResponse(error, { key }))
      return
    }
  }

  ws.on('message', (messageData) => {
    let messageUnvalidated, message
    try {
      messageUnvalidated = JSON.parse(messageData.toString())
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
