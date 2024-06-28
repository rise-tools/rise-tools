import { getModelState } from './model-utils'
import { ValueModel, ViewModel } from './types'

export function view<T>(
  loadInput: (get: <V>(model: ValueModel<V>) => V | undefined) => T
): ViewModel<T> {
  let state: T | undefined = undefined
  let isValid = false
  let deps = new Set<ValueModel<any>>()
  let depSubs = new Map<ValueModel<any>, () => void>()
  const subHandlers = new Set<(newState: T) => void>()
  let updateSchedule: undefined | NodeJS.Timeout = undefined
  function get(): T {
    if (isValid) return state as T
    depSubs.forEach((unsub) => unsub()) // unsubscribe from all deps
    deps = new Set<ValueModel<any>>()
    depSubs = new Map<ValueModel<any>, () => void>()
    function getter<V>(model: ValueModel<V>): V | undefined {
      if (typeof model !== 'function') {
        deps.add(model)
        depSubs.set(
          model,
          model.subscribe(() => {
            isValid = false
            clearTimeout(updateSchedule)
            updateSchedule = setTimeout(get, 1)
          })
        )
      }
      return getModelState(model)
    }
    const newState = loadInput(getter)
    state = newState
    isValid = true
    subHandlers.forEach((handler) => handler(newState))
    return newState
  }
  async function load() {
    // TODO: bug found! make sure dependencies are loaded here!
    return get()
  }
  function subscribe(listener: (newState: T) => void) {
    listener(get())
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
