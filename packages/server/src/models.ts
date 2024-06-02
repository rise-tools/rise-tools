// import { JSONValue } from '@final-ui/react'

// export type Model<Value extends JSONValue> = {
//   get: () => Promise<Value>
//   set: (value: Value) => Promise<void>
//   invalidate: () => void
//   subscribe: (handler: (value: Value) => void) => () => void
//   debugLabel: string
// }

// type TrackedDependencies = {
//   model: Model<any>
//   deps: Set<Model<any>>
// }
// let closeCount = 0
// let _debugNextCreatedModelLabel = 'unknown'
// let _enableDebug = false
// export function _setEnableDebug(enableDebug: boolean) {
//   _enableDebug = enableDebug
// }
// export function _setDebugNextModelLabel(label: string) {
//   _debugNextCreatedModelLabel = label
// }
// console.log('== init models.ts')

// const resetters = new Set<() => void>()
// function doResettersSoon() {
//   setTimeout(() => {
//     resetters.forEach((resetter) => {
//       resetter()
//       resetters.delete(resetter)
//     })
//   }, 1)
// }
// const dependencyTracker: TrackedDependencies[] = []

// function openDependencyTracker(model: Model<any>) {
//   dependencyTracker.unshift({ model, deps: new Set() })
// }

// function closeDependencyTracker(model: Model<any>): Set<Model<any>> {
//   console.log('will close dep tracker', dependencyTracker.length)
//   const nextTracked = dependencyTracker?.[0]
//   if (!nextTracked) throw new Error('dependency tracker broken: no tracked dep')
//   if (model !== nextTracked.model)
//     throw new Error(
//       'dependency tracker: did not expect this model. expected: ' +
//         nextTracked.model.debugLabel +
//         ' got: ' +
//         model.debugLabel
//     )
//   dependencyTracker.shift()
//   console.log('closed dep tracker', dependencyTracker.length)
//   return nextTracked.deps
// }

// function markDependency(model: Model<any>) {
//   if (!dependencyTracker) return
//   if (dependencyTracker.find((item) => item.model === model))
//     throw new Error('circular dependency: ' + model.debugLabel + ' depends on itself!')
//   dependencyTracker.forEach((item) => item.deps.add(model))
// }

// export async function createModel<T extends JSONValue>(init: T | (() => T | Promise<T>)) {
//   let deps: Set<Model<any>> = new Set<Model<any>>()
//   let depSubscriptions: Set<() => void> = new Set()
//   let isInvalid = true

//   const debugLabel = _debugNextCreatedModelLabel

//   function _debug(info: string) {
//     if (!_enableDebug) return
//     console.log(`${debugLabel}: ${info}`)
//   }

//   async function _loadValue() {
//     _debug('openDependencyTracker')
//     openDependencyTracker(model)
//     const initState = typeof init === 'function' ? await init() : init
//     depSubscriptions.forEach((releaseSub) => releaseSub())
//     deps = closeDependencyTracker(model)
//     _debug(
//       'closeDependencyTracker ' +
//         Array.from(deps)
//           .map((dep) => dep.debugLabel)
//           .join(',')
//     )
//     _debug('dep tracker: ' + dependencyTracker.map((item) => item.model.debugLabel).join(','))
//     if (closeCount > 4) throw new Error('too many closes!')
//     closeCount += 1
//     depSubscriptions = new Set()
//     deps.forEach((depModel) => {
//       depSubscriptions.add(
//         depModel.subscribe(() => {
//           // dependency has changed. invalidate ourself
//           invalidate()
//         })
//       )
//     })
//     return initState
//   }
//   let state: undefined | T = undefined
//   if (typeof init !== 'function') {
//     state = init
//     isInvalid = false
//   }

//   const subscribers = new Set<(value: T) => void>()

//   function invalidate() {
//     _debug('invalidate')
//     isInvalid = true
//     // maybe we should schedule this to avoid redundant extra changes?!:
//     if (subscribers.size > 0) {
//       // _scheduleReset()
//       _reset()
//     }
//   }

//   function _blast() {
//     const blastState = state
//     if (blastState === undefined) throw new Error('state is undefined')
//     subscribers.forEach((handler) => handler(blastState))
//   }

//   async function _reset() {
//     state = await _loadValue()
//     isInvalid = false
//     _blast()
//   }

//   function _scheduleReset() {
//     resetters.add(_reset)
//     doResettersSoon()
//   }

//   const model: Model<T> = {
//     async get() {
//       _debug('markDependency')
//       _debug(
//         'get ' +
//           (isInvalid ? '(invalid)' : '(valid)') +
//           Array.from(deps)
//             .map((dep) => dep.debugLabel)
//             .join(',')
//       )
//       markDependency(model)
//       if (isInvalid) {
//         await _reset()
//       }
//       if (state === undefined) throw new Error('state is undefined')
//       return state
//     },

//     async set(newValue: T) {
//       _debug('set: will apply')
//       state = newValue
//       isInvalid = false
//       _debug('set: will blast')
//       _blast()
//     },

//     invalidate,

//     subscribe(handler: (value: T) => void) {
//       subscribers.add(handler)
//       return () => {
//         subscribers.delete(handler)
//       }
//     },

//     debugLabel,
//   }
//   return model
// }
