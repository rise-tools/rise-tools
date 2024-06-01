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
  value?: T | PayloadStateModifier
): UpdateStateAction<T>
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
  return obj !== null && typeof obj === 'object' && obj.$ === 'state-modifier'
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

export const LocalState = createContext<LocalState>({})
