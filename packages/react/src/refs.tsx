import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

import {
  ActionModelState,
  ActionsDefinition,
  BaseRise,
  ComponentRegistry,
  HandlerEvent,
  isComponentModelState,
  isCompositeModelState,
  isEventModelState,
  isHandlerEvent,
  isResponseModelState,
  ModelState,
  Path,
  ReferencedModelState,
  ResponseModelState,
  RiseEvent,
} from './rise'
import { isStateUpdateAction, LocalState, useLocalState } from './state'
import { Stream } from './streams'
import { lookupValue } from './utils'

export type Store<T = ModelState> = Stream<T>

export type ModelSource = {
  get: (key: string) => Store
  sendEvent: (event: HandlerEvent) => Promise<ResponseModelState>
}

/** Refs */
type DataValues = Record<string, ModelState>

function extractRefValue(dataValues: DataValues, ref: ReferencedModelState['ref']) {
  const value = lookupValue(dataValues, ref)

  if (isComponentModelState(value)) {
    return {
      ...value,
      path: ref,
    }
  }

  return value
}

export function ref(ref: string | Path): ReferencedModelState {
  return {
    $: 'ref',
    ref: Array.isArray(ref) ? ref : [ref],
  }
}

export function extractRefKey(ref: string | Path) {
  if (typeof ref === 'string') {
    return ref
  }
  return ref[0]
}

function findAllRefs(stateNode: ModelState, dataValues: DataValues): Set<string> {
  const currentRefKeys = new Set<string>()
  function searchRefs(stateNode: ModelState | object) {
    if (!stateNode || typeof stateNode !== 'object') {
      return
    }
    if (Array.isArray(stateNode)) {
      stateNode.forEach(searchRefs)
      return
    }
    if (!isCompositeModelState(stateNode)) {
      Object.values(stateNode).forEach(searchRefs)
      return
    }
    if (stateNode.$ === 'ref') {
      const refKey = extractRefKey(stateNode.ref)
      if (!currentRefKeys.has(refKey)) {
        currentRefKeys.add(refKey)
        const lastValue = dataValues[refKey]
        searchRefs(lastValue)
      }
      return
    }
    if (stateNode.$ === 'component') {
      searchRefs(stateNode.children)
      searchRefs(stateNode.props)
      return
    }
  }
  searchRefs(stateNode)
  return currentRefKeys
}

function createRefStateManager(
  initialDataValues: DataValues,
  setDataValues: Dispatch<SetStateAction<DataValues>>,
  dataSource: ModelSource,
  rootKey: string
) {
  let dataValues = initialDataValues
  let refSubscriptions: Record<string, () => void> = {}
  function setRefValue(refKey: string, value: ModelState) {
    if (dataValues[refKey] !== value) {
      dataValues = { ...dataValues, [refKey]: value }
      setDataValues(dataValues)
      return true
    }
    return false
  }
  function ensureSubscription(key: string) {
    if (!refSubscriptions[key]) {
      const refValueProvider = dataSource.get(key)
      refSubscriptions[key] = refValueProvider.subscribe((value) => {
        const didUpdate = setRefValue(key, value)
        if (didUpdate) {
          performSubscriptions()
        }
      })
      setRefValue(key, refValueProvider.get())
    }
  }
  function performSubscriptions() {
    ensureSubscription(rootKey)
    const rootState = dataSource.get(rootKey).get()
    const referencedRefs = findAllRefs(rootState, dataValues)
    referencedRefs.add(rootKey)
    referencedRefs.forEach(ensureSubscription)
    Object.entries(refSubscriptions).forEach(([key, release]) => {
      if (!referencedRefs.has(key)) {
        release()
        delete refSubscriptions[key]
      }
    })
  }
  function releaseSubscriptions() {
    Object.values(refSubscriptions).forEach((release) => release())
    refSubscriptions = {}
    dataValues = {}
  }
  return {
    activate() {
      performSubscriptions()
      return releaseSubscriptions
    },
  }
}

function resolveValueRefs(dataValues: DataValues, value: ModelState): ModelState {
  if (!value || typeof value !== 'object') {
    return value
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveValueRefs(dataValues, item))
  }
  if (typeof value === 'object') {
    if (isCompositeModelState(value) && value.$ === 'ref') {
      return resolveRef(dataValues, value.ref)
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        return [key, resolveValueRefs(dataValues, item)]
      })
    )
  }
}

function resolveRef(dataValues: DataValues, lookup: ReferencedModelState['ref']): ModelState {
  const value = extractRefValue(dataValues, lookup)
  return resolveValueRefs(dataValues, value)
}

export function Rise({
  components,
  modelSource,
  path = [''],
  actions = {},
  onEvent = modelSource.sendEvent,
}: {
  path?: string | Path
  modelSource: ModelSource
  components: ComponentRegistry
  actions?: ActionsDefinition<any[]>
  onEvent?: (event: HandlerEvent) => Promise<ResponseModelState>
}) {
  if (typeof path === 'string') {
    path = [path]
  }

  /* refs */
  const rootKey = extractRefKey(path)
  const [dataValues, setDataValues] = useState<DataValues>({
    [rootKey]: modelSource.get(rootKey).get(),
  })
  const refStateManager = useRef(
    createRefStateManager(dataValues, setDataValues, modelSource, rootKey)
  )
  useEffect(() => {
    const release = refStateManager.current.activate()
    return () => release()
  }, [])
  const rootModelState = resolveRef(dataValues, path)

  /* state */
  const [localState, applyStateUpdateAction] = useLocalState()

  /* actions */
  const handleAction = useCallback(
    (action: ActionModelState) => {
      const actionDefinition = actions[action.name]
      if (!actionDefinition) {
        throw new Error(`Unknown action: ${action.name}`)
      }
      // eslint-disable-next-line
      let { $, name, ...payload } = action
      if (actionDefinition.validate) {
        try {
          actionDefinition.action(actionDefinition.validate(payload))
        } catch (e) {
          console.error(`Invalid payload for action "${action.name}":`, e)
        }
      } else {
        actionDefinition.action(payload)
      }
    },
    [actions]
  )

  const handleEvent = useCallback(
    async (event: RiseEvent) => {
      const eventActions = isEventModelState(event.dataState)
        ? event.dataState.actions
        : event.dataState
      for (const action of eventActions || []) {
        if (isStateUpdateAction(action)) {
          applyStateUpdateAction(action, event.payload)
        } else {
          handleAction(action)
        }
      }
      if (!isHandlerEvent(event)) {
        return
      }
      if (event.dataState.args) {
        event.payload = [
          Object.fromEntries(
            Object.entries(event.dataState.args).map(([key, value]) => {
              return [key, localState.getStream(value).get()]
            })
          ),
        ]
      }
      const res = await onEvent(event)
      if (!isResponseModelState(res)) {
        throw new Error(
          `Invalid response from "onEvent" handler. Expected ServerResponseModelState. Received: ${JSON.stringify(res)}`
        )
      }
      if (res.actions) {
        for (const action of res.actions) {
          if (isStateUpdateAction(action)) {
            applyStateUpdateAction(action, event.payload)
          } else {
            handleAction(action)
          }
        }
      }
      if (!res.ok) {
        throw res.payload
      }
      return res.payload
    },
    [handleAction, onEvent]
  )

  return (
    <LocalState.Provider value={localState}>
      <BaseRise components={components} path={path} model={rootModelState} onEvent={handleEvent} />
    </LocalState.Provider>
  )
}
