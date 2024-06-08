import { QueryModel } from './types'

export function query<V>(loadInput: () => Promise<V>): QueryModel<V> {
  let state: V | undefined = undefined
  const subscribers = new Set<(state: V) => void>()
  let isValid = false
  function updateData(newData: V) {
    state = newData
    subscribers.forEach((listener) => listener(newData))
  }
  async function load() {
    if (isValid) {
      if (state === undefined) {
        throw new Error('Query error: state is valid but undefined')
      }
      return state
    }
    const newData = await loadInput()
    if (newData === undefined) {
      throw new Error('Query error: data is undefined')
    }
    updateData(newData)
    isValid = true
    return newData
  }
  return {
    type: 'query',
    get: () => {
      return state
    },
    invalidate: () => {
      isValid = false
    },
    load,
    resolve: async () => {
      if (!isValid) await load()
    },
    subscribe: (listener) => {
      subscribers.add(listener)
      if (state !== undefined) listener(state)
      return () => {
        subscribers.delete(listener)
      }
    },
  }
}
