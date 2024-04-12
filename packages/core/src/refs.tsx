import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

import {
  BaseTemplate,
  ComponentRegistry,
  DataState,
  DataStateType,
  isCompositeDataState,
  TemplateEvent,
} from './template'

export type Store<V = DataState> = {
  get: () => V
  subscribe: (handler: () => void) => () => void
}

export type DataSource = {
  get: (key: string) => Store
}

/** Refs */
type DataValues = Record<string, DataState>

type RefLookup = string | [string, ...(string | number)[]]

function extractRefValue(dataValues: DataValues, ref: RefLookup) {
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

function extractRefKey(ref: RefLookup) {
  if (typeof ref === 'string') {
    return ref
  }
  return ref[0]
}

function findAllRefs(stateNode: DataState, dataValues: DataValues): Set<string> {
  const currentRefKeys = new Set<string>()
  function searchRefs(stateNode: DataState) {
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
    if (stateNode.$ === DataStateType.Ref) {
      const refKey = extractRefKey(stateNode.ref)
      if (!currentRefKeys.has(refKey)) {
        currentRefKeys.add(refKey)
        const lastValue = dataValues[refKey]
        searchRefs(lastValue)
      }
      return
    }
    if (stateNode.$ === DataStateType.Component) {
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
      refSubscriptions[key] = refValueProvider.subscribe(() => {
        const didUpdate = setRefValue(key, refValueProvider.get())
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
    if (isCompositeDataState(value) && value.$ === DataStateType.Ref) {
      return resolveRef(dataValues, value.ref)
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        return [key, resolveValueRefs(dataValues, item)]
      })
    )
  }
}

function resolveRef(dataValues: DataValues, lookup: RefLookup): DataState {
  const value = extractRefValue(dataValues, lookup)
  return resolveValueRefs(dataValues, value)
}

export function Template({
  components,
  dataSource,
  onEvent,
  path = '',
}: {
  path?: RefLookup
  dataSource: DataSource
  components: ComponentRegistry
  onEvent: (event: TemplateEvent) => void
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
  return <BaseTemplate components={components} dataState={rootDataState} onEvent={onEvent} />
}
