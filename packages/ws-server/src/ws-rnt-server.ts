import { ActionEvent, getAllEventHandlers, isHandlerEvent, ServerDataState } from '@final-ui/react'
import type {
  ClientWebsocketMessage,
  EventWebsocketMessage,
  ServerWebsocketMessage,
  SubscribeWebsocketMessage,
  UnsubscribeWebsocketMessage,
} from '@final-ui/ws-client'
import WebSocket from 'ws'

type ActionEventHandler = (
  event: ActionEvent,
  eventOpts: {
    time: number
    clientId: string
  }
) => void

export function createWSServer(port: number) {
  const wss = new WebSocket.Server({ port })

  const values = new Map<string, ServerDataState>()

  const clientSubscribers = new Map<string, Map<string, () => void>>()
  const eventSubscribers = new Set<ActionEventHandler>()
  const subscribers = new Map<string, Set<(value: ServerDataState) => void>>()

  let clientIdIndex = 0

  const clientSenders = new Map<string, (value: ServerWebsocketMessage) => void>()

  const eventHandlers = new Map<string, Record<string, (args: any) => any>>()

  function update(key: string, value: ServerDataState) {
    values.set(key, value)

    const allEventHandlers = getAllEventHandlers(value)
    eventHandlers.set(key, allEventHandlers)

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

  async function handleMessage(clientId: string, message: EventWebsocketMessage) {
    if (!isHandlerEvent(message.event)) {
      eventSubscribers.forEach((handler) => handler(message.event, { time: Date.now(), clientId }))
      return
    }

    const {
      dataState,
      target: { path },
    } = message.event

    try {
      const handleEvent = eventHandlers.get(path)?.[dataState.key]
      if (!handleEvent) {
        console.warn(
          `Missing event handler on the server for event: ${JSON.stringify(message.event)}`
        )
        return
      }
      const res = await handleEvent(message.event)
      if (dataState.async) {
        clientSenders.get(clientId)?.({
          $: 'evt-res',
          key: dataState.key,
          ok: true,
          val: res,
        })
      }
    } catch (error: any) {
      if (dataState.async) {
        clientSenders.get(clientId)?.({
          $: 'evt-res',
          key: dataState.key,
          ok: false,
          val: error,
        })
        return
      }
      console.warn(
        `Unhandled exception in event handler: ${message.event}. Error: ${JSON.stringify(error)}`
      )
    }
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
          return handleMessage(clientId, message)
        default:
          console.log('Unrecognized message:', messageString)
          return
      }
    })
  })

  function updateRoot(value: any) {
    update('', value)
  }

  function onActionEvent(handler: ActionEventHandler) {
    eventSubscribers.add(handler)
    return () => eventSubscribers.delete(handler)
  }

  function get(key: string) {
    return values.get(key)
  }

  function subscribe(key: string, handler: (value?: ServerDataState) => void) {
    const handlers =
      subscribers.get(key) ||
      (() => {
        const handlers = new Set<(value: ServerDataState) => void>()
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

  return { update, onActionEvent, subscribe, get, updateRoot }
}
