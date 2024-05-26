import type { ReactElement } from 'react'

import { ServerResponseDataState } from './response'
import {
  ActionDataState,
  ActionsDataState,
  DataState,
  EventDataState,
  isEventDataState,
  JSONValue,
} from './template'

/** Server data state*/
export type ServerDataState = DataState | ServerEventDataState
export type RuntimeServerDataState = Exclude<ServerDataState, ReactElement>

type ServerHandlerReturnType = ServerResponseDataState | JSONValue | void
export type ServerHandlerFunction = (
  args: any
) => Promise<ServerHandlerReturnType> | ServerHandlerReturnType
export type ServerEventDataState = EventDataState & {
  handler: ServerHandlerFunction
}
export function isServerEventDataState(obj: RuntimeServerDataState): obj is ServerEventDataState {
  return isEventDataState(obj) && 'handler' in obj && typeof obj.handler === 'function'
}

type Action = ActionDataState | ActionDataState[]

export function event(action: Action): ActionsDataState
export function event(func: ServerHandlerFunction, action?: Action): ServerEventDataState
export function event(
  func: ServerHandlerFunction | Action,
  action: Action = []
): ServerEventDataState | ActionsDataState {
  if (typeof func === 'function') {
    return {
      $: 'event',
      handler: func,
      actions: Array.isArray(action) ? action : [action],
    }
  } else {
    return {
      $: 'actions',
      actions: Array.isArray(func) ? func : [func],
    }
  }
}

export function action<T = any>(name: T): ActionDataState<T> {
  return {
    $: 'action',
    name,
  }
}
