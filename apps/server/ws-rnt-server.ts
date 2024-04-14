import { DataState, TemplateEvent } from '@react-native-templates/core'
import { ClientWebsocketMessage, ServerWebsocketMessage } from '@react-native-templates/ws-client'
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
    const handlers: Map<string, () => void> = clientSubscribers.has(key)
      ? clientSubscribers.get(key)
      : (() => {
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

  function clientSubscribes(clientId: string, keys: string[]) {
    keys.forEach((key: string) => clientSubscribe(clientId, key))
  }

  function clientUnsubscribes(clientId: string, keys: string[]) {
    keys.forEach((key: string) => clientUnsubscribe(clientId, key))
  }

  function handleEvent(clientId: string, event: TemplateEvent) {
    eventSubscribers.forEach((handler) =>
      handler({
        event,
        eventOtps: { time: Date.now(), clientId },
      })
    )
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
          return clientSubscribes(clientId, message.keys)
        case 'unsub':
          return clientUnsubscribes(clientId, message.keys)
        case 'evt':
          return handleEvent(clientId, message.event)
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

  wss.on('listening', () => {
    console.log(`WebSocket server started on port ${port}`)
  })

  return { update, subscribeEvent, get, updateRoot }
}
