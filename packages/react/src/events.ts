import crypto from 'node:crypto'

import { ServerHandlerResponse } from './response'
import {
  HandlerEventDataState,
  isComponentDataState,
  isEventDataState,
  JSONValue,
} from './template'

/** Server data state*/
export type ServerDataState = JSONValue | ServerHandlerEventDataState
export type ServerHandlerEventDataState<T = ServerHandlerFunction | AsyncServerHandlerFunction> =
  HandlerEventDataState & {
    handler: T
  }
export function isServerEventDataState(obj: ServerDataState): obj is ServerHandlerEventDataState {
  return isEventDataState(obj) && 'handler' in obj && typeof obj.handler === 'function'
}

export function getAllEventHandlers(dataState: ServerDataState) {
  const acc: Record<string, ServerHandlerFunction | AsyncServerHandlerFunction> = {}
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

type ServerHandlerFunction = (args: any) => ServerHandlerResponse | JSONValue
export function handler(
  func: ServerHandlerFunction
): ServerHandlerEventDataState<ServerHandlerFunction> {
  const key = crypto.randomUUID()
  return {
    $: 'event',
    key,
    async: false,
    handler: func,
  }
}

type AsyncServerHandlerFunction = (args: any) => Promise<ReturnType<ServerHandlerFunction>>
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
