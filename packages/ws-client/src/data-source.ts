import type { DataSource, JSONValue, Store, TemplateEvent } from '@final-ui/react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { json } from 'typia'

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

export type ClientWebsocketMessage =
  | SubscribeWebsocketMessage
  | UnsubscribeWebsocketMessage
  | EventWebsocketMessage

export type ServerWebsocketMessage = UpdateWebsocketMessage

type Handler = () => void

export function createWSDataSource(wsUrl: string): DataSource {
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
    const event = json.assertParse<ServerWebsocketMessage>(eventData.data)
    if (event['$'] === 'up') {
      cache.set(event.key, event.val)
      const handlers = subscriptions.get(event.key)
      if (handlers) {
        handlers.forEach((handle) => handle())
      }
    } else {
      console.log(`Unknown message: ${JSON.stringify(event)}`)
    }
  }

  const stores = new Map<string, Store>()

  function createStore(key: string) {
    const handlers =
      subscriptions.get(key) ||
      (() => {
        const handlers = new Set<Handler>()
        subscriptions.set(key, handlers)
        return handlers
      })()

    return {
      get: () => cache.get(key),
      subscribe: (handler: () => void) => {
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
      send({ $: 'evt', event })
    },
  }

  return dataSource
}
