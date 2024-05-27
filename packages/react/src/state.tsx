import { createContext } from 'react'

import { action } from './events'
import { ActionDataState, JSONValue, StateDataState } from './template'

export function state(initialValue: JSONValue): [StateDataState, ActionDataState] {
  const key = (Date.now() * Math.random()).toString(16)
  return [{ $: 'state', key, initialValue }, action(['state-update', key])]
}

export type LocalState = {
  values: Record<string, JSONValue>
  setValue: (key: string, value: JSONValue) => void
}

export const LocalStateContext = createContext<LocalState>({
  get values(): never {
    throw new Error('Wrap your form with a <RiseForm /> component')
  },
  setValue: () => {
    throw new Error('Wrap your form with a <RiseForm /> component')
  },
})
