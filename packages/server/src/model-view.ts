import { ValueModel, ViewModel } from './types'

export function view<T>(
  loadInput: (get: <V>(model: ValueModel<V>) => V | undefined) => T
): ViewModel<T> {
  let state: T | undefined = undefined
  let isInvalid = true
  let deps = new Set<ValueModel<any>>()
  let depSubs = new Map<ValueModel<any>, () => void>()
  const subHandlers = new Set<(newState: T) => void>()
  function get(): T {
    if (!isInvalid) return state as T
    depSubs.forEach((unsub) => unsub()) // unsubscribe from all deps
    deps = new Set<ValueModel<any>>()
    depSubs = new Map<ValueModel<any>, () => void>()
    function getter<V>(model: ValueModel<V>): V | undefined {
      deps.add(model)
      depSubs.set(
        model,
        model.subscribe(() => {
          isInvalid = true
        })
      )
      if (model.type === 'query') {
        return model.get()
      } else if (model.type === 'state') {
        return model.get()
      } else if (model.type === 'view') {
        return model.get()
      }
      throw new Error('Unrecognized model')
    }
    const newState = loadInput(getter)
    state = newState
    isInvalid = false
    subHandlers.forEach((handler) => handler(newState))
    return newState
  }
  async function load() {
    return get()
  }
  function subscribe(listener: (newState: T) => void) {
    if (state !== undefined) listener(get())
    subHandlers.add(listener)
    return () => {
      subHandlers.delete(listener)
    }
  }
  async function resolve() {
    return Promise.resolve()
  }
  return {
    type: 'view',
    get,
    load,
    subscribe,
    resolve,
  }
}
