import crypto from 'node:crypto'

import type { ReactElement } from 'react'

import { ServerResponseDataState } from './response'
import {
  ActionDataState,
  ActionEventDataState,
  DataState,
  HandlerEventDataState,
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
export type ServerEventDataState = HandlerEventDataState & {
  handler: ServerHandlerFunction
}
export function isServerEventDataState(obj: RuntimeServerDataState): obj is ServerEventDataState {
  return isEventDataState(obj) && 'handler' in obj && typeof obj.handler === 'function'
}

type Action = ActionDataState | ActionDataState[]

export function event(action: Action): ActionEventDataState
export function event(func: ServerHandlerFunction, action?: Action): ServerEventDataState
export function event(
  func: ServerHandlerFunction | Action,
  action: Action = []
): ServerEventDataState | ActionEventDataState {
  if (typeof func === 'function') {
    const key = crypto.randomUUID()
    return {
      $: 'event',
      key,
      handler: func,
      actions: Array.isArray(action) ? action : [action],
    }
  } else {
    return {
      $: 'event',
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
