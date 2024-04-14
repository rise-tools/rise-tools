import type { DataSource, JSONValue, Store, TemplateEvent } from '@react-native-templates/core'
import ReconnectingWebSocket from 'reconnecting-websocket'

export type ClientWebsocketMessage =
  | {
      $: 'sub'
      keys: string[]
    }
  | {
      $: 'unsub'
      keys: string[]
    }
  | {
      $: 'evt'
      event: TemplateEvent
    }

export type ServerWebsocketMessage = {
  $: 'up'
  key: string
  val: JSONValue
}

export function createWSDataSource(
  wsUrl: string,
  interceptEvent?: (event: TemplateEvent) => boolean
): DataSource {
  const rws = new ReconnectingWebSocket(wsUrl)
  function send(payload: ClientWebsocketMessage) {
    rws.send(JSON.stringify(payload))
  }
  const subscriptions = new Map<string, Set<() => void>>()
  const cache = new Map<string, any>()

  rws.addEventListener('open', () => {
    const keys = [...subscriptions.entries()]
      .filter(([, handlers]) => handlers.size > 0)
      .map(([key]) => key)
    if (keys.length === 0) return
    send({
      $: 'sub',
      keys,
    })
  })

  // tbd: what's this type?
  rws.onmessage = (eventData) => {
    const event = JSON.parse(eventData.data)
    if (event['$'] === 'up') {
      const { key, val } = event
      cache.set(key, val)
      const handlers = subscriptions.get(key)
      if (handlers) handlers.forEach((handle) => handle())
    } else {
      console.log('unknown message', event.data)
    }
  }

  const stores = new Map<string, Store>()

  function createStore(key: string) {
    // @ts-ignore fix this later
    const handlers: Set<() => void> = subscriptions.has(key)
      ? subscriptions.get(key)
      : (() => {
          const handlers = new Set<() => void>()
          subscriptions.set(key, handlers)
          return handlers
        })()
    return {
      get: () => cache.get(key),
      subscribe: (handler: () => void) => {
        console.log('sub to key', JSON.stringify(key))
        const shouldSubscribeRemotely = handlers.size === 0
        handlers.add(handler)
        if (shouldSubscribeRemotely) {
          send({
            $: 'sub',
            keys: [key],
          })
        }
        return () => {
          console.log('unsub from key', JSON.stringify(key))
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
  const dataSource: DataSource = {
    get: (key: string) => {
      const store = stores.get(key)
      if (store) {
        return store
      }
      const newStore = createStore(key)
      stores.set(key, newStore)
      return newStore
    },
    sendEvent: (event) => {
      if (interceptEvent?.(event)) {
        return
      }
      send({ $: 'evt', event })
    },
  }
  return dataSource
}
