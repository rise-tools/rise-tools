import { useSyncExternalStore } from 'react'

import { JSONValue } from './template'

type Updater<S> = (prevState: S) => S
export type WritableStream<S> = [(newState: S | Updater<S>) => void, Stream<S>]

export type Stream<V> = {
  get: () => V
  subscribe: (handler: (value: V) => void) => () => void
}

export function createWritableStream<S extends JSONValue>(initState: S): WritableStream<S> {
  let state: S = initState
  const handlers = new Set<(state: S) => void>()
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
  return [
    function writeState(updater) {
      const newState = typeof updater === 'function' ? updater(state) : updater

      state = newState

      handlers.forEach((handle) => handle(newState))
    },
    stream,
  ]
}

export function useStream<S>(stream?: Stream<S>) {
  return useSyncExternalStore(
    (onStoreChange) => {
      return stream ? stream.subscribe(onStoreChange) : () => {}
    },
    () => stream?.get()
  )
}
