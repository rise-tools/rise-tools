import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { action } from './events'
import { createWritableStream, Stream, WritableStream } from './streams'
import { ActionDataState, JSONValue, StateDataState } from './template'
import { lookupValue } from './utils'

type StateUpdate<T> = T | StateModifier
type UpdateStateAction<T> = ActionDataState<['state-update', StateDataState<T>, StateUpdate<T>]>

type StateModifier =
  | PayloadStateModifier
  | ToggleStateModifier
  | IncrementStateModifier
  | LookupStateModifier
type PayloadStateModifier = {
  $: 'state-modifier'
  type: 'payload'
}
type ToggleStateModifier = {
  $: 'state-modifier'
  type: 'toggle'
}
type IncrementStateModifier = {
  $: 'state-modifier'
  type: 'increment'
  value: number
}
type LookupStateModifier = {
  $: 'state-modifier'
  type: 'lookup'
  path: (string | number)[]
}

export function isStateUpdateAction<T extends JSONValue>(
  action: ActionDataState
): action is UpdateStateAction<T> {
  return action.name[0] === 'state-update'
}

export function state<T extends JSONValue>(initialValue: T): StateDataState<T> {
  const key = (Date.now() * Math.random()).toString(16)
  return { $: 'state', key, initialValue }
}

export function setStateAction(
  state: StateDataState<number>,
  value?: number | IncrementStateModifier
): UpdateStateAction<number>
export function setStateAction(
  state: StateDataState<boolean>,
  value?: boolean | ToggleStateModifier
): UpdateStateAction<boolean>
export function setStateAction<T extends JSONValue>(
  state: StateDataState<T>,
  value?: T | PayloadStateModifier | LookupStateModifier
): UpdateStateAction<T>
export function setStateAction<T>(
  state: StateDataState<T>,
  value: T | StateModifier = eventPayload
): UpdateStateAction<T> {
  return action(['state-update', state, value])
}

export type LocalState = {
  getStream(state: StateDataState): Stream<JSONValue>
}

export const useLocalState = (): [
  LocalState,
  (action: UpdateStateAction<JSONValue>, payload: JSONValue[]) => void,
] => {
  const localState = useRef<Record<string, WritableStream<JSONValue>>>({})
  function getWritableStream(state: StateDataState) {
    if (!localState.current[state.key]) {
      localState.current[state.key] = createWritableStream(state.initialValue)
    }
    return localState.current[state.key] as WritableStream<JSONValue>
  }
  return [
    {
      getStream(state) {
        const [, stream] = getWritableStream(state)
        return stream
      },
    },
    (action, payload: JSONValue[]) => {
      const [, state, stateUpdate] = action.name
      const [write] = getWritableStream(state)
      write((currentValue) => applyStateUpdateAction(currentValue, stateUpdate, payload))
    },
  ]
}

export const LocalState = createContext<LocalState>({
  getStream: () => {
    throw new Error('LocalState context not initialized')
  },
})

function isStateModifier(obj: any): obj is StateModifier {
  return obj !== null && typeof obj === 'object' && obj.$ === 'state-modifier'
}

export function applyStateUpdateAction<T extends JSONValue>(
  state: T,
  stateUpdate: StateUpdate<T>,
  payload: JSONValue[]
) {
  if (!isStateModifier(stateUpdate)) {
    return stateUpdate
  }
  switch (stateUpdate.type) {
    case 'payload': {
      return payload[0]
    }
    case 'toggle': {
      return !state
    }
    case 'lookup': {
      return lookupValue(payload, stateUpdate.path)
    }
    case 'increment':
      if (typeof state !== 'number') {
        throw new Error('Cannot increment non-number state.')
      }
      return state + stateUpdate.value
    default: {
      throw new Error('Unknown state modifier.')
    }
  }
}

export const eventPayload: PayloadStateModifier = {
  $: 'state-modifier',
  type: 'payload',
}

export const toggle: ToggleStateModifier = {
  $: 'state-modifier',
  type: 'toggle',
}

export const increment = (value: number): IncrementStateModifier => ({
  $: 'state-modifier',
  type: 'increment',
  value,
})

export const lookup = (path: (string | number)[]): LookupStateModifier => ({
  $: 'state-modifier',
  type: 'lookup',
  path,
})

export const useLocalStateValues = () => {
  const localState = useContext(LocalState)

  const [, forceUpdate] = useState({})

  const streams = useRef(new Map<string, Stream<JSONValue>>())
  const subs = useRef([] as (() => void)[])

  function get(state: StateDataState) {
    const stream = localState.getStream(state)

    if (!streams.current.has(state.key)) {
      subs.current.push(
        stream.subscribe(() => {
          forceUpdate({})
        })
      )
      streams.current.set(state.key, stream)
    }

    return stream.get()
  }

  useEffect(() => {
    for (const stream of streams.current.values()) {
      subs.current.push(
        stream.subscribe(() => {
          forceUpdate({})
        })
      )
    }
    return () => {
      for (const unsubscribe of subs.current) {
        unsubscribe()
      }
    }
  }, [])

  return get
}
