import { createContext } from 'react'

import { action } from './events'
import { ActionDataState, JSONValue, StateDataState } from './template'

type StateValue<T> = T | StateModifier

type StateModifier = {
  $: 'state-modifier'
  value: 'payload' | 'toggle'
}
function isStateModifier(obj: any): obj is StateModifier {
  return obj !== null && typeof obj === 'object' && '$' in obj && obj.$ === 'state-modifier'
}

type SetStateAction<T> = ActionDataState<['state-update', string, StateValue<T>]>
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

export function modifyState<T extends JSONValue>(
  state: T,
  nextState: StateValue<T>,
  payload: JSONValue
) {
  if (isStateModifier(nextState)) {
    switch (nextState.value) {
      case 'payload': {
        return payload
      }
      case 'toggle': {
        return !state
      }
    }
  }
  return nextState
}

export const eventPayload = {
  $: 'state-modifier',
  value: 'payload',
} as const

export const toggle = {
  $: 'state-modifier',
  value: 'toggle',
} as const

export type LocalState = {
  values: Record<string, JSONValue>
  setValue: (key: string, value: JSONValue) => void
}

export const LocalState = createContext<LocalState>({
  get values(): never {
    throw new Error('Wrap your form with a <RiseForm /> component')
  },
  setValue: () => {
    throw new Error('Wrap your form with a <RiseForm /> component')
  },
})
