import { useSyncExternalStore } from 'react'

import { JSONValue } from './rise'

type Updater<S> = (prevState: S) => S

export type Stream<V> = {
  get: () => V
  subscribe: (handler: (value: V) => void) => () => void
}

export type WritableStream<S> = [Stream<S>, (updater: S | Updater<S>) => void]

export function createWritableStream<S extends JSONValue>(initState: S): WritableStream<S> {
  let state: S = initState
  const handlers = new Set<(state: S) => void>()
  return [
    {
      get() {
        return state
      },
      subscribe(handler: (state: S) => void) {
        handlers.add(handler)
        return () => {
          handlers.delete(handler)
        }
      },
    },
    function write(updater) {
      const newState = typeof updater === 'function' ? updater(state) : updater
      state = newState
      handlers.forEach((handle) => handle(newState))
    },
  ]
}

export function useStream<T>(stream: Stream<T>): T {
  return useSyncExternalStore(
    (onStoreChange) => {
      return stream ? stream.subscribe(onStoreChange) : () => {}
    },
    () => stream.get()
  )
}
