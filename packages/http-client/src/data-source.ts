import { type DataSource, DataState, Store } from '@final-ui/react'

type Handler = (value: DataState) => void

export type HTTPDataSource = DataSource

export function createHTTPDataSource(httpUrl: string): HTTPDataSource {
  const subscriptions = new Map<string, Set<Handler>>()
  const cache = new Map<string, any>()

  const stores = new Map<string, Store>()

  function createStore(key: string): Store {
    const handlers =
      subscriptions.get(key) ||
      (() => {
        const handlers = new Set<Handler>()
        subscriptions.set(key, handlers)
        return handlers
      })()

    // dumb auto fetcher. we should wait for somebody to subscribe
    fetch(`${httpUrl}/${key}`)
      .then((resp) => resp.json())
      .then((value) => {
        cache.set(key, value)
        handlers.forEach((handler) => handler(value))
      })

    return {
      get: () => cache.get(key),
      subscribe: (handler) => {
        const shouldSubscribeRemotely = handlers.size === 0
        if (shouldSubscribeRemotely) {
          // tbd: sub
        }
        return () => {
          handlers.delete(handler)
          const shouldUnsubscribeRemotely = handlers.size === 0
          if (shouldUnsubscribeRemotely) {
            // tbd: unsub
          }
        }
      },
    }
  }

  // const promises = new Map<string, (value: ServerResponseDataState) => void>()

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
    sendEvent: async () => {
      throw new Error('Unsupported')
    },
  }
}
