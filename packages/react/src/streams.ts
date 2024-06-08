import { useSyncExternalStore } from 'react'

import { JSONValue } from './template'

type Updater<S> = (prevState: S) => S

export type Stream<V> = {
  get: () => V
  subscribe: (handler: (value: V) => void) => () => void
}

export type WritableStream<S> = Stream<S> & {
  write: (updater: S | Updater<S>) => void
}

export function createWritableStream<S extends JSONValue>(initState: S): WritableStream<S> {
  let state: S = initState
  const handlers = new Set<(state: S) => void>()
  return {
    get() {
      return state
    },
    write(updater) {
      const newState = typeof updater === 'function' ? updater(state) : updater
      state = newState
      handlers.forEach((handle) => handle(newState))
    },
    subscribe(handler: (state: S) => void) {
      handlers.add(handler)
      return () => {
        handlers.delete(handler)
      }
    },
  }
}

export function useStream<T>(stream: Stream<T>): T
export function useStream<T>(stream: Stream<T> | undefined): T | undefined {
  return useSyncExternalStore(
    (onStoreChange) => {
      return stream ? stream.subscribe(onStoreChange) : () => {}
    },
    () => stream?.get()
  )
}
