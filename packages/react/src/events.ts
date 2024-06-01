import type { ReactElement } from 'react'

import {
  ActionDataState,
  DataState,
  EventDataState,
  HandlerFunction,
  isEventDataState,
  isHandlerDataState,
  StateDataState,
} from './template'

/** Server data state*/
export type ServerDataState = DataState | ServerEventDataState
export type RuntimeServerDataState = Exclude<ServerDataState, ReactElement>

export type ServerEventDataState = EventDataState & {
  handler: HandlerFunction
}
export function isServerEventDataState(obj: RuntimeServerDataState): obj is ServerEventDataState {
  if (!isEventDataState(obj)) {
    return false
  }
  return (
    typeof obj.handler === 'function' ||
    (isHandlerDataState(obj.handler) && typeof obj.handler.func === 'function')
  )
}

export function event(
  func: HandlerFunction,
  opts?: {
    actions?: ActionDataState[]
    timeout?: number
  }
): EventDataState {
  return {
    $: 'event',
    handler: func,
    actions: opts?.actions,
    timeout: opts?.timeout,
  }
}

export function action<T = any>(name: T): ActionDataState<T> {
  return {
    $: 'action',
    name,
  }
}

export function withState<T extends Record<string, any>>(
  state: { [K in keyof T]: StateDataState<T[K]> },
  handler: HandlerFunction<T>
) {
  return {
    $: 'handler',
    handler,
    state,
  }
}

withState(
  {
    isOpen: { $: 'state', key: 'isOpen', initialValue: false },
    isOpen2: { $: 'state', key: 'isOpen', initialValue: 5 },
  },
  (args) => {
    console.log(args)
  }
)
