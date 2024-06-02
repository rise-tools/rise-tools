import { useSyncExternalStore } from 'react'

import { JSONValue } from './template'

export type Stream<V> = {
  get: () => V
  subscribe: (handler: (value: V) => void) => () => void
}

type Updater<S> = (prevState: S) => S

export function createWritableStream<S extends JSONValue>(
  initState: S
): [(newState: S | Updater<S>) => void, Stream<S>] {
  let state: S = initState
  const handlers = new Set<(state: S) => void>()
  function writeState(updater: S | Updater<S>) {
    const newState = typeof updater === 'function' ? updater(state) : updater

    state = newState

    handlers.forEach((handle) => handle(newState))
  }
  const stream = {
    get() {
      return state
    },
    subscribe(handler: (state: S) => void) {
      handlers.add(handler)
      return () => {
        handlers.delete(handler)
      }
    },
  }
  return [writeState, stream]
}

export function useStream<S>(stream?: Stream<S>) {
  return useSyncExternalStore(
    (onStoreChange) => {
      return stream ? stream.subscribe(onStoreChange) : () => {}
    },
    () => stream?.get()
  )
}
