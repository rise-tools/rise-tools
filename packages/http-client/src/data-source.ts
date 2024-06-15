import {
  HandlerEvent,
  type ModelSource,
  ModelState,
  ResponseModelState,
  Store,
} from '@rise-tools/react'

type Handler = (value: ModelState) => void

export type HTTPModelSource = ModelSource
export type EventPayload = {
  $: 'evt'
  event: HandlerEvent
}

export type EventResponse = {
  $: 'evt-res'
  res: ResponseModelState
}

export function createHTTPModelSource(httpUrl: string): HTTPModelSource {
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

    return {
      get: () => cache.get(key),
      subscribe: (handler) => {
        const shouldFetch = handlers.size === 0
        // tbd: this should return promise so it works with Suspense on the client
        if (shouldFetch) {
          fetch(`${httpUrl}/${key}`)
            .then((resp) => resp.json())
            .then((value) => {
              cache.set(key, value)
              handlers.forEach((handler) => handler(value))
            })
        }
        handlers.add(handler)
        return () => {
          handlers.delete(handler)
        }
      },
    }
  }

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
    sendEvent: async (event) => {
      const req = await fetch(httpUrl, {
        method: 'POST',
        body: JSON.stringify({ event }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const message = (await req.json()) as EventResponse
      return message.res
    },
  }
}
