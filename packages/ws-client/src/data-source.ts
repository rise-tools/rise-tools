import {
  createWritableStream,
  type DataSource,
  DataState,
  HandlerEvent,
  ResponseDataState,
  Store,
  Stream,
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
  key: string
  event: HandlerEvent
}

export type UpdateWebsocketMessage = {
  $: 'up'
  key: string
  val: DataState
}

export type EventResponseWebsocketMessage = {
  $: 'evt-res'
  key: string
  res: ResponseDataState
}

export type ClientWebsocketMessage =
  | SubscribeWebsocketMessage
  | UnsubscribeWebsocketMessage
  | EventWebsocketMessage

export type ServerWebsocketMessage = UpdateWebsocketMessage | EventResponseWebsocketMessage

type Handler = (value: DataState) => void

type WebSocketState = {
  status?: 'connected' | 'disconnected'
}

export type WebSocketDataSource = DataSource & {
  state: Stream<WebSocketState>
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
        const { res } = event
        const resolve = promises.get(event.key)
        if (resolve) {
          resolve(res)
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

  const promises = new Map<string, (value: ResponseDataState) => void>()

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
    state: createStateStream(rws),
    sendEvent: async (event) => {
      const key = (Date.now() * Math.random()).toString(16)
      send({ $: 'evt', event, key })
      return new Promise((resolve, reject) => {
        promises.set(key, resolve)
        setTimeout(() => {
          if (promises.has(key)) {
            reject(new Error('Request timeout'))
            promises.delete(key)
          }
        }, event.dataState.timeout || 10_000)
      })
    },
  }
}

const createStateStream = (ws: ReconnectingWebSocket) => {
  const [state, write] = createWritableStream<WebSocketState>({ status: undefined })

  ws.addEventListener('open', () => write({ status: 'connected' }))
  ws.addEventListener('close', () => write({ status: 'disconnected' }))
  ws.addEventListener('error', () => write({ status: 'disconnected' }))

  return state
}
