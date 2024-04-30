import {
  createWritableStream,
  type DataSource,
  DataSourceStateStream,
  isHandlerEvent,
  type JSONValue,
  Store,
  type TemplateEvent,
} from '@final-ui/react'
import ReconnectingWebSocket from 'reconnecting-websocket'

export type SubscribeWebsocketMessage = {
  $: 'sub'
  keys: string[]
}

export type UnsubscribeWebsocketMessage = {
  $: 'unsub'
  keys: string[]
}

export type EventWebsocketMessage = {
  $: 'evt'
  event: TemplateEvent
}

export type UpdateWebsocketMessage = {
  $: 'up'
  key: string
  val: JSONValue
}

export type EventResponseWebsocketMessage = {
  $: 'evt-res'
  key: string
  ok: boolean
  val: JSONValue
}

export type ClientWebsocketMessage =
  | SubscribeWebsocketMessage
  | UnsubscribeWebsocketMessage
  | EventWebsocketMessage

export type ServerWebsocketMessage = UpdateWebsocketMessage | EventResponseWebsocketMessage

type Handler = (value: JSONValue) => void
type PromiseHandler = (value: any) => void

export type WebSocketDataSource = DataSource & {
  state: DataSourceStateStream
}

export function createWSDataSource(wsUrl: string): WebSocketDataSource {
  const rws = new ReconnectingWebSocket(wsUrl)
  function send(payload: ClientWebsocketMessage) {
    rws.send(JSON.stringify(payload))
  }

  const subscriptions = new Map<string, Set<Handler>>()
  const cache = new Map<string, any>()

  rws.addEventListener('open', () => {
    const keys = [...subscriptions.entries()]
      .filter(([, handlers]) => handlers.size > 0)
      .map(([key]) => key)
    if (keys.length === 0) {
      return
    }
    send({
      $: 'sub',
      keys,
    })
  })

  rws.onmessage = (eventData) => {
    const event = JSON.parse(eventData.data) as ServerWebsocketMessage
    switch (event['$']) {
      case 'up': {
        cache.set(event.key, event.val)
        const handlers = subscriptions.get(event.key)
        if (handlers) {
          handlers.forEach((handle) => handle(event.val))
        }
        break
      }
      case 'evt-res': {
        const promise = promises.get(event.key)
        if (promise) {
          const [resolve, reject] = promise
          if (event.ok) {
            resolve(event.val)
          } else {
            reject(event.val)
          }
          promises.delete(event.key)
        } else {
          console.warn(
            `No callback registered for the event: ${JSON.stringify(event)}. If your request takes more than 10 seconds, you may need to provide a custom timeout.`
          )
        }
        break
      }
      default: {
        console.log(`Unknown message: ${JSON.stringify(event)}`)
      }
    }
  }

  const stores = new Map<string, Store>()

  function createStore(key: string): Store {
    const handlers =
      subscriptions.get(key) ||
      (() => {
        const handlers = new Set<Handler>()
        subscriptions.set(key, handlers)
        return handlers
      })()

    return {
      get: () => cache.get(key),
      subscribe: (handler) => {
        const shouldSubscribeRemotely = handlers.size === 0
        handlers.add(handler)
        if (shouldSubscribeRemotely) {
          send({
            $: 'sub',
            keys: [key],
          })
        }
        return () => {
          handlers.delete(handler)
          const shouldUnsubscribeRemotely = handlers.size === 0
          if (shouldUnsubscribeRemotely) {
            send({
              $: 'unsub',
              keys: [key],
            })
          }
        }
      },
    }
  }

  const promises = new Map<string, [PromiseHandler, PromiseHandler]>()

  return {
    get: (key: string) => {
      const store = stores.get(key)
      if (store) {
        return store
      }
      const newStore = createStore(key)
      stores.set(key, newStore)
      return newStore
    },
    state: createStatusStream(rws),
    sendEvent: async (event) => {
      send({ $: 'evt', event })
      if (isHandlerEvent(event)) {
        return new Promise((resolve, reject) => {
          promises.set(event.dataState.key, [resolve, reject])
          setTimeout(() => {
            if (promises.has(event.dataState.key)) {
              reject(new Error('Request timeout'))
              promises.delete(event.dataState.key)
            }
          }, event.dataState.timeout || 10_000)
        })
      }
    },
  }
}

const createStatusStream = (ws: ReconnectingWebSocket) => {
  const [writeInfo, info] = createWritableStream({ status: readyStateToStatus(ws.readyState) })

  const updateStatus = () => writeInfo({ status: readyStateToStatus(ws.readyState) })
  ws.addEventListener('open', updateStatus)
  ws.addEventListener('close', updateStatus)
  ws.addEventListener('error', updateStatus)

  return info
}

const readyStateToStatus = (readyState: number) => {
  switch (readyState) {
    case WebSocket.CONNECTING:
      return 'connecting' as const
    case WebSocket.OPEN:
      return 'connected' as const
    case WebSocket.CLOSING:
      return 'closing' as const
    case WebSocket.CLOSED:
      return 'closed' as const
    default:
      return 'undetermined' as const
  }
}
