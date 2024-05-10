import crypto from 'node:crypto'

import { ServerResponseDataState } from './response'
import {
  ActionEventDataState,
  DataState,
  HandlerEventDataState,
  isComponentDataState,
  isEventDataState,
  JSONValue,
} from './template'

/** Server data state*/
export type ServerDataState = DataState | ServerEventDataState
type ServerHandlerReturnType = ServerResponseDataState | JSONValue | void
export type ServerHandlerFunction = (
  args: any
) => Promise<ServerHandlerReturnType> | ServerHandlerReturnType
export type ServerEventDataState = HandlerEventDataState & {
  handler: ServerHandlerFunction
}
export function isServerEventDataState(obj: ServerDataState): obj is ServerEventDataState {
  return isEventDataState(obj) && 'handler' in obj && typeof obj.handler === 'function'
}

export function getAllEventHandlers(dataState: ServerDataState) {
  const acc: Record<string, ServerHandlerFunction> = {}
  function traverse(dataState: ServerDataState) {
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

export function handler(
  func: ServerHandlerFunction,
  action: ActionEventDataState | ActionEventDataState[]
): ServerEventDataState {
  const key = crypto.randomUUID()
  return {
    $: 'event',
    key,
    handler: func,
    actions: Array.isArray(action) ? action : [action],
  }
}

export function action(action: any): ActionEventDataState {
  return {
    $: 'event',
    action,
  }
}
