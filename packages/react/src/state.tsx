import { createContext, useReducer } from 'react'

import { action } from './events'
import { ActionDataState, JSONValue, StateDataState } from './template'

export type LocalState = Record<string, JSONValue>

type StateUpdate<T> = T | StateModifier
type UpdateStateAction<T> = ActionDataState<['state-update', StateDataState<T>, StateUpdate<T>]>

type StateModifier = PayloadStateModifier | ToggleStateModifier | IncrementStateModifier
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

export function isStateUpdateAction<T extends JSONValue>(
  action: ActionDataState
): action is UpdateStateAction<T> {
  return action.name[0] === 'state-update'
}

export function state<T extends JSONValue>(initialValue: T): StateDataState<T> {
  const key = (Date.now() * Math.random()).toString(16)
  return { $: 'state', key, initialValue }
}

export function setStateAction<T>(
  state: StateDataState<T>,
  value: T | StateModifier = eventPayload
): UpdateStateAction<T> {
  return action(['state-update', state, value])
}

export const useLocalState = () => {
  return useReducer(stateReducer, {})
}

const stateReducer = (
  localState: LocalState,
  { action, payload }: { action: UpdateStateAction<JSONValue>; payload: JSONValue }
) => {
  const [, stateDataState, stateUpdate] = action.name
  const currentState = localState[stateDataState.key] || stateDataState.initialValue
  return {
    ...localState,
    [stateDataState.key]: applyStateUpdateAction(currentState, stateUpdate, payload),
  }
}

function isStateModifier(obj: any): obj is StateModifier {
  return obj !== null && typeof obj === 'object' && '$' in obj && obj.$ === 'state-modifier'
}

function applyStateUpdateAction<T extends JSONValue>(
  state: T,
  stateUpdate: StateUpdate<T>,
  payload: JSONValue
) {
  if (!isStateModifier(stateUpdate)) {
    return stateUpdate
  }
  switch (stateUpdate.type) {
    case 'payload': {
      return payload
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

export const eventPayload: StateModifier = {
  $: 'state-modifier',
  type: 'payload',
}

export const toggle: StateModifier = {
  $: 'state-modifier',
  type: 'toggle',
}

export const increment = (value: number): StateModifier => ({
  $: 'state-modifier',
  type: 'increment',
  value,
})

export const LocalState = createContext<LocalState>({})
