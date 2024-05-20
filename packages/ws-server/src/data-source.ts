import {
  HandlerEvent,
  isReactElement,
  isResponseDataState,
  isServerEventDataState,
  lookupValue,
  MaybeAsync,
  response,
  ServerDataState,
  UI,
} from '@final-ui/react'
import type {
  ClientWebsocketMessage,
  EventWebsocketMessage,
  ServerWebsocketMessage,
  SubscribeWebsocketMessage,
  UnsubscribeWebsocketMessage,
} from '@final-ui/ws-client'

type EventSubscriber = (
  event: HandlerEvent,
  eventOpts: {
    time: number
    clientId: string
  }
) => void

type Initializer = ServerDataState | UI | (() => MaybeAsync<ServerDataState | UI>)

export function createWSServerDataSource() {
  const values = new Map<string, Initializer>()

  const clientSubscribers = new Map<string, Map<string, () => void>>()
  const eventSubscribers = new Set<EventSubscriber>()
  const subscribers = new Map<string, Set<(value: ServerDataState) => void>>()

  let clientIdIndex = 0

  const clientSenders = new Map<string, (value: ServerWebsocketMessage) => void>()

  function update(key: string, value: Initializer) {
    if (isReactElement(value)) {
      throw new Error(
        'Rise JSX not configured. You must set "jsx" to "react-jsx" and "jsxImportSource" to "@final-ui/react" in your tsconfig.json.'
      )
    }
    values.set(key, value)

    const handlers = clientSubscribers.get(key)
    if (!handlers) return
    handlers.forEach((handler) => handler())
  }

  async function get(key: string) {
    let value = values.get(key)
    if (typeof value === 'function') {
      value = await value()
    }
    if (isReactElement(value)) {
      throw new Error(
        'Rise JSX not configured. You must set "jsx" to "react-jsx" and "jsxImportSource" to "@final-ui/react" in your tsconfig.json.'
      )
    }
    return value
  }

  function clientSubscribe(clientId: string, key: string) {
    async function send() {
      const sender = clientSenders.get(clientId)
      if (!sender) {
        return
      }
      sender({ $: 'up', key, val: await get(key) })
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

  function clientUnsubscribe(clientId: string, key: string) {
    const handlers = clientSubscribers.get(key)
    handlers?.delete(clientId)
  }

  function clientSubscribes(clientId: string, message: SubscribeWebsocketMessage) {
    message.keys.forEach((key: string) => clientSubscribe(clientId, key))
  }

  function clientUnsubscribes(clientId: string, message: UnsubscribeWebsocketMessage) {
    message.keys.forEach((key: string) => clientUnsubscribe(clientId, key))
  }

  async function handleMessage(clientId: string, message: EventWebsocketMessage) {
    const {
      dataState,
      target: { path },
    } = message.event

    eventSubscribers.forEach((handler) => handler(message.event, { time: Date.now(), clientId }))

    try {
      const [storeName, ...lookupPath] = path
      const store = await get(storeName)
      const value = lookupValue(store, lookupPath)
      if (!isServerEventDataState(value)) {
        throw new Error(
          `Missing event handler on the server for event: ${JSON.stringify(message.event)}`
        )
      }
      let res = await value.handler(message.event)
      if (!isResponseDataState(res)) {
        res = response(res ?? null)
      }
      clientSenders.get(clientId)?.({
        $: 'evt-res',
        key: dataState.key,
        res,
      })
    } catch (error: any) {
      clientSenders.get(clientId)?.({
        $: 'evt-res',
        key: dataState.key,
        res: response(error).status(500),
      })
      return
    }
  }

  /// <reference lib="dom" />
  function handleWSConnection(ws: WebSocket) {
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

    ws.addEventListener('message', function incoming(event: MessageEvent) {
      const message = JSON.parse(event.data.toString()) as ClientWebsocketMessage
      switch (message['$']) {
        case 'sub':
          return clientSubscribes(clientId, message)
        case 'unsub':
          return clientUnsubscribes(clientId, message)
        case 'evt':
          return handleMessage(clientId, message)
        default:
          console.log(`Unrecognized message: ${JSON.stringify(event)}`)
          return
      }
    })
  }

  function updateRoot(value: Initializer) {
    update('', value)
  }

  // dead code - do we find this useful?
  async function subscribe(key: string, handler: (value?: ServerDataState) => void) {
    const handlers =
      subscribers.get(key) ||
      (() => {
        const handlers = new Set<(value: ServerDataState) => void>()
        subscribers.set(key, handlers)
        return handlers
      })()
    handler(await get(key))
    handlers.add(handler)
    return () => handlers.delete(handler)
  }

  function onEvent(subscriber: EventSubscriber) {
    eventSubscribers.add(subscriber)
    return () => eventSubscribers.delete(subscriber)
  }

  return { update, onEvent, subscribe, get, updateRoot, handleWSConnection }
}
