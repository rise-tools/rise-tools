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
export type ServerDataState = DataState | ServerHandlerEventDataState
export type ServerHandlerEventDataState<T = ServerHandlerFunction> = HandlerEventDataState & {
  handler: T
}
export function isServerEventDataState(obj: ServerDataState): obj is ServerHandlerEventDataState {
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

type SyncServerHandlerFunction = (args: any) => ServerResponse | JSONValue
export function handler(
  func: SyncServerHandlerFunction
): ServerHandlerEventDataState<SyncServerHandlerFunction> {
  const key = crypto.randomUUID()
  return {
    $: 'event',
    key,
    async: false,
    handler: func,
  }
}

type AsyncServerHandlerFunction = (args: any) => Promise<ReturnType<SyncServerHandlerFunction>>
export function asyncHandler(
  func: AsyncServerHandlerFunction
): ServerHandlerEventDataState<AsyncServerHandlerFunction> {
  const key = crypto.randomUUID()
  return {
    $: 'event',
    key,
    async: true,
    handler: func,
  }
}

export type ServerHandlerFunction = SyncServerHandlerFunction | AsyncServerHandlerFunction
