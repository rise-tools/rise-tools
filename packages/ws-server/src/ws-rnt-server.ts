import type { DataState, TemplateEvent } from '@final-ui/react'
import type {
  ClientWebsocketMessage,
  EventWebsocketMessage,
  ServerWebsocketMessage,
  SubscribeWebsocketMessage,
  UnsubscribeWebsocketMessage,
} from '@final-ui/ws-client'
import WebSocket from 'ws'

type EventHandler = (
  event: TemplateEvent,
  eventOpts: {
    time: number
    clientId: string
  }
) => void

export function createWSServer(port: number) {
  const wss = new WebSocket.Server({ port })

  const values = new Map<string, DataState>()

  const clientSubscribers = new Map<string, Map<string, () => void>>()
  const eventSubscribers = new Set<EventHandler>()
  const subscribers = new Map<string, Set<(value: DataState) => void>>()

  let clientIdIndex = 0

  const clientSenders = new Map<string, (value: ServerWebsocketMessage) => void>()

  function update(key: string, value: any) {
    values.set(key, value)
    const handlers = clientSubscribers.get(key)
    if (!handlers) return
    handlers.forEach((handler) => handler())
  }

  function clientSubscribe(clientId: string, key: string) {
    function send() {
      const sender = clientSenders.get(clientId)
      if (!sender) {
        return
      }
      sender({ $: 'up', key, val: values.get(key) })
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

  function handleEvent(clientId: string, message: EventWebsocketMessage) {
    eventSubscribers.forEach((handler) => handler(message.event, { time: Date.now(), clientId }))
  }

  wss.on('connection', function connection(ws) {
    const clientId = `c${clientIdIndex}`
    clientIdIndex += 1
    console.log(`Client ${clientId} connected`)

    function sendClient(value: any) {
      ws.send(JSON.stringify(value))
    }

    clientSenders.set(clientId, sendClient)

    ws.on('close', function close() {
      clientSenders.delete(clientId)
      console.log(`Client ${clientId} disconnected`)
    })

    ws.on('message', function incoming(messageString: string) {
      const message = JSON.parse(messageString.toString()) as ClientWebsocketMessage
      switch (message['$']) {
        case 'sub':
          return clientSubscribes(clientId, message)
        case 'unsub':
          return clientUnsubscribes(clientId, message)
        case 'evt':
          return handleEvent(clientId, message)
        default:
          console.log('Unrecognized message:', messageString)
          return
      }
    })
  })

  function updateRoot(value: any) {
    update('', value)
  }

  function subscribeEvent(handler: EventHandler) {
    eventSubscribers.add(handler)
    return () => eventSubscribers.delete(handler)
  }

  function get(key: string) {
    return values.get(key)
  }

  function subscribe(key: string, handler: (value?: DataState) => void) {
    const handlers =
      subscribers.get(key) ||
      (() => {
        const handlers = new Set<(value: DataState) => void>()
        subscribers.set(key, handlers)
        return handlers
      })()
    handler(values.get(key))
    handlers.add(handler)
    return () => handlers.delete(handler)
  }

  wss.on('listening', () => {
    console.log(`WebSocket server started on port ${port}`)
  })

  return { update, subscribeEvent, subscribe, get, updateRoot }
}
