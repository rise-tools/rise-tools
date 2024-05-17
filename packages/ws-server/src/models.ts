import { JSONValue } from '@final-ui/react'

type Model<Value extends JSONValue> = {
  get: () => Value
  set: (value: Value) => void
  invalidate: () => void
  subscribe: (handler: (value: Value) => void) => () => void
  debugLabel: string
}

type TrackedDependencies = {
  model: Model<any>
  deps: Set<Model<any>>
}
let closeCount = 0
let _debugNextCreatedModelLabel = 'unknown'
let _enableDebug = false
export function _setEnableDebug(enableDebug: boolean) {
  _enableDebug = enableDebug
}
export function _setDebugNextModelLabel(label: string) {
  _debugNextCreatedModelLabel = label
}

const resetters = new Set<() => void>()
function doResettersSoon() {
  setTimeout(() => {
    resetters.forEach((resetter) => {
      resetter()
      resetters.delete(resetter)
    })
  }, 1)
}
const dependencyTracker: TrackedDependencies[] = []

function openDependencyTracker(model: Model<any>) {
  dependencyTracker.unshift({ model, deps: new Set() })
}

function closeDependencyTracker(model: Model<any>): Set<Model<any>> {
  const nextTracked = dependencyTracker?.[0]
  if (!nextTracked) throw new Error('dependency tracker broken: no tracked dep')
  if (model !== nextTracked.model) throw new Error('dependency tracker: did not expect this model')
  dependencyTracker.unshift()
  // console.log('--- closedTracking', nextTracked.deps)
  return nextTracked.deps
}

function markDependency(model: Model<any>) {
  if (!dependencyTracker) return
  if (dependencyTracker.find((item) => item.model === model))
    throw new Error('circular dependency?!')
  dependencyTracker.forEach((item) => item.deps.add(model))
}

export function createModel<T extends JSONValue>(init: T | (() => T)) {
  let deps: Set<Model<any>> = new Set<Model<any>>()
  let depSubscriptions: Set<() => void> = new Set()
  let isInvalid = false

  const debugLabel = _debugNextCreatedModelLabel

  function _debug(info: string) {
    if (!_enableDebug) return
    console.log(`${debugLabel}: ${info}`)
  }

  function _loadValue() {
    _debug('openDependencyTracker')
    openDependencyTracker(model)
    const initState = typeof init === 'function' ? init() : init
    depSubscriptions.forEach((releaseSub) => releaseSub())
    deps = closeDependencyTracker(model)
    _debug(
      'closeDependencyTracker ' +
        Array.from(deps)
          .map((dep) => dep.debugLabel)
          .join(',')
    )
    if (closeCount > 4) throw new Error('too many closes!')
    closeCount += 1
    depSubscriptions = new Set()
    deps.forEach((depModel) => {
      depSubscriptions.add(
        depModel.subscribe(() => {
          // dependency has changed. invalidate ourself
          invalidate()
        })
      )
    })
    return initState
  }
  let state = _loadValue()
  const subscribers = new Set<(value: T) => void>()

  function invalidate() {
    _debug('invalidate')
    isInvalid = true
    // maybe we should schedule this to avoid redundant extra changes?!:
    if (subscribers.size > 0) {
      _scheduleReset()
    }
  }

  function _blast() {
    subscribers.forEach((handler) => handler(state))
  }

  function _reset() {
    state = _loadValue()
    isInvalid = false
    _blast()
  }

  function _scheduleReset() {
    resetters.add(_reset)
    doResettersSoon()
  }

  const model: Model<T> = {
    get() {
      _debug('markDependency')
      markDependency(model)
      if (isInvalid) _reset()
      return state
    },

    set(newValue: T) {
      state = newValue
      _blast()
    },

    invalidate,

    subscribe(handler: (value: T) => void) {
      subscribers.add(handler)
      return () => {
        subscribers.delete(handler)
      }
    },

    debugLabel,
  }
  return model
}
