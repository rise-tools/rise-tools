import {
  createWritableStream,
  EventRequest,
  EventResponse,
  type ModelSource,
  ModelState,
  Store,
  Stream,
} from '@rise-tools/react'
import ReconnectingWebSocket from 'reconnecting-websocket'

export type SubscribeWebsocketMessage = {
  $: 'sub'
  keys: string[]
}

export type UnsubscribeWebsocketMessage = {
  $: 'unsub'
  keys: string[]
}

export type UpdateWebsocketMessage = {
  $: 'up'
  key: string
  val: ModelState
}

export type ClientWebsocketMessage =
  | SubscribeWebsocketMessage
  | UnsubscribeWebsocketMessage
  | EventRequest<unknown>

export type ServerWebsocketMessage = UpdateWebsocketMessage | EventResponse<unknown>

type Handler = (value: ModelState) => void

type WebSocketState = {
  status?: 'connected' | 'disconnected'
}

export type WebSocketModelSource = ModelSource & {
  state: Stream<WebSocketState>
}

export function createWSModelSource(wsUrl: string): WebSocketModelSource {
  const rws = new ReconnectingWebSocket(wsUrl)
  function send(payload: ClientWebsocketMessage) {
    rws.send(JSON.stringify(payload))
  }

  const subscriptions = new Map<string, Set<Handler>>()
  const cache = new Map<string, any>()

  rws.addEventListener('open', () => {
    const keys = [...subscriptions.entries()]
      .filter(([key, handlers]) => !!key && handlers.size > 0)
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
        const resolve = promises.get(event.key)
        if (resolve) {
          resolve(event)
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
        if (shouldSubscribeRemotely && key) {
          send({
            $: 'sub',
            keys: [key],
          })
        }
        return () => {
          console.log('client unsub', key)
          handlers.delete(handler)
          const shouldUnsubscribeRemotely = handlers.size === 0
          if (shouldUnsubscribeRemotely) {
            send({
              $: 'unsub',
              keys: [key].filter((key) => key != null),
            })
          }
        }
      },
    }
  }

  const promises = new Map<string, (value: EventResponse<any>) => void>()

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
      send(event)
      // send({ $: 'evt', event, key })
      return new Promise((resolve, reject) => {
        promises.set(event.key, resolve)
        setTimeout(() => {
          if (promises.has(event.key)) {
            reject(new Error('Request timeout'))
            promises.delete(event.key)
          }
        }, event.modelState.timeout || 10_000)
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
