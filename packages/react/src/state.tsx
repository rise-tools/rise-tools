import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { action } from './events'
import { ActionModelState, JSONValue, StateModelState } from './rise'
import { createWritableStream, Stream, WritableStream } from './streams'
import { lookupValue } from './utils'

type StateUpdate<T> = T | StateModifier
type UpdateStateAction<T> = ActionModelState<
  'state-update',
  { state: StateModelState<T>; update: StateUpdate<T> }
>

type StateModifier = PayloadStateModifier | ToggleStateModifier | IncrementStateModifier
type PayloadStateModifier = {
  $: 'state-modifier'
  type: 'payload'
  path?: (string | number)[]
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

export function isStateUpdateAction<T extends JSONValue>(
  action: ActionModelState
): action is UpdateStateAction<T> {
  return action.name === 'state-update'
}

export function localStateExperimental<T extends JSONValue>(
  initialValue: T,
  key: string
): StateModelState<T> {
  return { $: 'state', key, initialValue }
}

export function setStateAction(
  state: StateModelState<number>,
  value?: number | IncrementStateModifier
): UpdateStateAction<number>
export function setStateAction(
  state: StateModelState<boolean>,
  value?: boolean | ToggleStateModifier
): UpdateStateAction<boolean>
export function setStateAction<T extends JSONValue>(
  state: StateModelState<T>,
  value?: T | PayloadStateModifier
): UpdateStateAction<T>
export function setStateAction<T>(
  state: StateModelState<T>,
  update: T | StateModifier = eventPayload()
): UpdateStateAction<T> {
  return action('state-update', { state, update })
}

export type LocalState = {
  getStream(state: StateModelState): Stream<JSONValue>
}

export const useLocalState = (): [
  LocalState,
  (action: UpdateStateAction<JSONValue>, payload: JSONValue[]) => void,
] => {
  const localState = useRef<Record<string, WritableStream<JSONValue>>>({})
  function getWritableStream(state: StateModelState) {
    if (!localState.current[state.key]) {
      localState.current[state.key] = createWritableStream(state.initialValue)
    }
    return localState.current[state.key] as WritableStream<JSONValue>
  }
  return [
    {
      getStream(state) {
        const [stream] = getWritableStream(state)
        return stream
      },
    },
    (action, payload: JSONValue[]) => {
      const [, write] = getWritableStream(action.state)
      write((currentValue) => applyStateUpdateAction(currentValue, action.update, payload))
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
      if (stateUpdate.path) {
        return lookupValue(payload, stateUpdate.path)
      }
      return payload[0]
    }
    case 'toggle': {
      return !state
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

export const eventPayload = (path?: PayloadStateModifier['path']): PayloadStateModifier => ({
  $: 'state-modifier',
  type: 'payload',
  path,
})

export const toggle: ToggleStateModifier = {
  $: 'state-modifier',
  type: 'toggle',
}

export const increment = (value: number): IncrementStateModifier => ({
  $: 'state-modifier',
  type: 'increment',
  value,
})

export const useLocalStateValues = () => {
  const localState = useContext(LocalState)

  const [, forceUpdate] = useState({})

  const streams = useRef(new Map<string, Stream<JSONValue>>())
  const subs = useRef([] as (() => void)[])

  function get(state: StateModelState) {
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
