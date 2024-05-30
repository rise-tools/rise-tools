import { createContext } from 'react'

import { action } from './events'
import { ActionDataState, JSONValue, StateDataState } from './template'

type StateUpdate<T> = T | StateModifier
type UpdateStateAction<T> = ActionDataState<['state-update', StateDataState<T>, StateUpdate<T>]>
type StateModifier = {
  $: 'state-modifier'
  value: 'payload' | 'toggle' | ['increment', number]
}

function isStateModifier(obj: any): obj is StateModifier {
  return obj !== null && typeof obj === 'object' && '$' in obj && obj.$ === 'state-modifier'
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

export function applyStateUpdateAction<T extends JSONValue>(
  state: T,
  action: UpdateStateAction<T>,
  payload: JSONValue
) {
  const [, initialState, stateUpdate] = action.name
  if (!isStateModifier(stateUpdate)) {
    return stateUpdate
  }
  if (Array.isArray(stateUpdate.value)) {
    const [type, value] = stateUpdate.value
    switch (type) {
      case 'increment': {
        const s = state || initialState.initialValue
        if (typeof s !== 'number') {
          // tbd: what do do here
          return value
        }
        return s + value
      }
      default: {
        throw new Error('Unknown state modifier.')
      }
    }
  }
  switch (stateUpdate.value) {
    case 'payload': {
      return payload
    }
    case 'toggle': {
      return !state
    }
    default: {
      throw new Error('Unknown state modifier.')
    }
  }
}

export const eventPayload: StateModifier = {
  $: 'state-modifier',
  value: 'payload',
}

export const toggle: StateModifier = {
  $: 'state-modifier',
  value: 'toggle',
}

export const increment = (value: number): StateModifier => ({
  $: 'state-modifier',
  value: ['increment', value],
})

export type LocalState = Record<string, JSONValue>
export const LocalState = createContext<LocalState>({})

export function reducer() {}
