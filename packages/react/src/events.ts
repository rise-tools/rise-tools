import crypto from 'node:crypto'

import { ServerResponse } from './response'
import {
  DataState,
  HandlerEventDataState,
  isComponentDataState,
  isEventDataState,
  JSONValue,
} from './template'

/** Server data state*/
export type ServerDataState = DataState | ServerEventDataState
export type ServerHandlerFunction = (args: any) => Promise<ServerResponse | JSONValue>
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

export function handler(func: ServerHandlerFunction): ServerEventDataState {
  const key = crypto.randomUUID()
  return {
    $: 'event',
    key,
    handler: func,
  }
}
