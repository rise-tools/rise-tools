import { createContext } from 'react'

import { action } from './events'
import { ActionDataState, JSONValue, StateDataState } from './template'

type StateUpdate<T> = T | StateModifier
type SetStateAction<T> = ActionDataState<['state-update', string, StateUpdate<T>]>
type StateModifier = {
  $: 'state-modifier'
  value: 'payload' | 'toggle'
}

function isStateModifier(obj: any): obj is StateModifier {
  return obj !== null && typeof obj === 'object' && '$' in obj && obj.$ === 'state-modifier'
}

export function isStateUpdateAction<T extends JSONValue>(
  action: ActionDataState
): action is SetStateAction<T> {
  return action.name[0] === 'state-update'
}

export function state<T extends JSONValue>(initialValue: T): StateDataState<T> {
  const key = (Date.now() * Math.random()).toString(16)
  return { $: 'state', key, initialValue }
}

export function setStateAction<T>(
  state: StateDataState<T>,
  value: T | StateModifier = eventPayload
): SetStateAction<T> {
  return action(['state-update', state.key, value])
}

export function applyStateUpdate<T extends JSONValue>(
  state: T,
  stateUpdate: StateUpdate<T>,
  payload: JSONValue
) {
  if (isStateModifier(stateUpdate)) {
    switch (stateUpdate.value) {
      case 'payload': {
        return payload
      }
      case 'toggle': {
        return !state
      }
    }
  }
  return stateUpdate
}

export const eventPayload: StateModifier = {
  $: 'state-modifier',
  value: 'payload',
}

export const toggle: StateModifier = {
  $: 'state-modifier',
  value: 'toggle',
}

export type LocalState = Record<string, JSONValue>

export const LocalState = createContext<LocalState>({})

export function reducer() {}
