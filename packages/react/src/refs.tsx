import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'

import { isResponseDataState, ServerResponseDataState } from './response'
import { Stream } from './streams'
import {
  ActionDataState,
  ActionEvent,
  BaseTemplate,
  ComponentRegistry,
  DataState,
  HandlerEvent,
  isComponentDataState,
  isCompositeDataState,
  isHandlerEvent,
  Path,
  ReferencedDataState,
} from './template'

export type Store<T = DataState> = Stream<T>

export type DataSource = {
  get: (key: string) => Store
  sendEvent: (event: HandlerEvent) => Promise<ServerResponseDataState>
}

/** Refs */
type DataValues = Record<string, DataState>

function lookupRefValue(dataValues: DataValues, ref: ReferencedDataState['ref']) {
  if (typeof ref === 'string') {
    return dataValues[ref]
  }

  const [refKey, ...lookupKeys] = ref

  let lookupValue = dataValues[refKey]
  for (const key of lookupKeys) {
    if (!lookupValue || typeof lookupValue !== 'object') {
      return undefined
    }
    // @ts-ignore
    lookupValue = lookupValue[key]
  }

  return lookupValue
}

function extractRefValue(dataValues: DataValues, ref: ReferencedDataState['ref']) {
  const value = lookupRefValue(dataValues, ref)

  if (isComponentDataState(value)) {
    return {
      ...value,
      path: ref,
    }
  }

  return value
}

export function extractRefKey(ref: Path) {
  if (typeof ref === 'string') {
    return ref
  }
  return ref[0]
}

function findAllRefs(stateNode: DataState, dataValues: DataValues): Set<string> {
  const currentRefKeys = new Set<string>()
  function searchRefs(stateNode: DataState | object) {
    if (!stateNode || typeof stateNode !== 'object') {
      return
    }
    if (Array.isArray(stateNode)) {
      stateNode.forEach(searchRefs)
      return
    }
    if (!isCompositeDataState(stateNode)) {
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
  setDataValues: Dispatch<SetStateAction<DataValues>>,
  dataSource: DataSource,
  rootKey: string
) {
  let dataValues: DataValues = {
    [rootKey]: dataSource.get(rootKey).get(),
  }
  let refSubscriptions: Record<string, () => void> = {}
  function setRefValue(refKey: string, value: DataState) {
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

function resolveValueRefs(dataValues: DataValues, value: DataState): DataState {
  if (!value || typeof value !== 'object') {
    return value
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveValueRefs(dataValues, item))
  }
  if (typeof value === 'object') {
    if (isCompositeDataState(value) && value.$ === 'ref') {
      return resolveRef(dataValues, value.ref)
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        return [key, resolveValueRefs(dataValues, item)]
      })
    )
  }
}

function resolveRef(dataValues: DataValues, lookup: ReferencedDataState['ref']): DataState {
  const value = extractRefValue(dataValues, lookup)
  return resolveValueRefs(dataValues, value)
}

export function Template({
  components,
  dataSource,
  path = '',
  onAction,
  onEvent = dataSource.sendEvent,
}: {
  path?: Path
  dataSource: DataSource
  components: ComponentRegistry
  onAction?: (action: ActionDataState) => void
  onEvent?: (event: HandlerEvent) => Promise<ServerResponseDataState>
}) {
  const [dataValues, setDataValues] = useState<DataValues>({})
  const refStateManager = useRef(
    createRefStateManager(setDataValues, dataSource, extractRefKey(path))
  )
  useEffect(() => {
    const release = refStateManager.current.activate()
    return () => release()
  }, [])
  const rootDataState = resolveRef(dataValues, path)
  const onTemplateEvent = useCallback(
    async (event: ActionEvent | HandlerEvent) => {
      for (const action of event.dataState.actions || []) {
        onAction?.(action)
      }
      if (!isHandlerEvent(event)) {
        return
      }
      const res = await onEvent(event)
      if (!isResponseDataState(res)) {
        throw new Error(
          `Invalid response from "onEvent" handler. Expected ServerResponseDataState. Received: ${JSON.stringify(res)}`
        )
      }
      if (res.actions) {
        for (const action of res.actions) {
          onAction?.(action)
        }
      }
      if (!res.ok) {
        throw res.payload
      }
      return res.payload
    },
    [onAction, onEvent]
  )
  return (
    <BaseTemplate
      components={components}
      path={path}
      dataState={rootDataState}
      onTemplateEvent={onTemplateEvent}
    />
  )
}
