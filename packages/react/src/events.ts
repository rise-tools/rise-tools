import crypto from 'node:crypto'

import type { ReactElement } from 'react'

import { ServerResponseDataState } from './response'
import {
  ActionDataState,
  ActionEventDataState,
  DataState,
  HandlerEventDataState,
  isComponentDataState,
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

export function getAllEventHandlers(dataState: RuntimeServerDataState) {
  const acc: Record<string, ServerHandlerFunction> = {}
  function traverse(dataState: RuntimeServerDataState) {
    if (!dataState || typeof dataState !== 'object') {
      return
    }
    if (Array.isArray(dataState)) {
      dataState.forEach(traverse)
      return
    }
    if (isComponentDataState(dataState)) {
      Object.values(dataState.props || {}).forEach(traverse)
      traverse(dataState.children)
      return
    }
    if (isServerEventDataState(dataState)) {
      acc[dataState.key] = dataState.handler
    }
  }
  traverse(dataState)
  return acc
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
