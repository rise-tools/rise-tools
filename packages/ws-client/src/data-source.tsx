import type { DataSource, Store } from '@react-native-templates/core'
import ReconnectingWebSocket from 'reconnecting-websocket'

export function createWSDataSource(
  wsUrl: string,
  interceptEvent?: (event: any) => boolean
): DataSource {
  const rws = new ReconnectingWebSocket(wsUrl)
  function send(payload: any) {
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
  const dataSource = {
    get: (key: string) => {
      const store = stores.get(key)
      if (store) return store
      const newStore = createStore(key)
      stores.set(key, newStore)
      return newStore
    },
    sendEvent: (path: string, name: string, value: any) => {
      if (interceptEvent?.({ path, name, value })) return
      send({ $: 'evt', path, name, value })
    },
  }
  return dataSource
}
