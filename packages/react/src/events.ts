import crypto from 'node:crypto'

import {
  HandlerEventDataState,
  isComponentDataState,
  isEventDataState,
  JSONValue,
} from './template'

/** Server data state*/
export type ServerDataState = JSONValue | ServerHandlerEventDataState
export type ServerHandlerEventDataState = HandlerEventDataState & {
  handler: (args: any) => void
}
export function isServerEventDataState(obj: ServerDataState): obj is ServerHandlerEventDataState {
  return isEventDataState(obj) && 'handler' in obj && typeof obj.handler === 'function'
}

export function getAllEventHandlers(dataState: ServerDataState) {
  const acc: Record<string, (args: any) => any> = {}
  function traverse(dataState: ServerDataState) {
    if (!dataState) {
      return
    }
    if (Array.isArray(dataState)) {
      dataState.forEach(traverse)
      return
    }
    if (isComponentDataState(dataState)) {
      Object.values(dataState.props || {}).forEach(traverse)
      return
    }
    if (isServerEventDataState(dataState)) {
      if (!dataState.handler) {
        throw new Error(
          `You must define "handler" function on the EventDataState. ${JSON.stringify(dataState)}`
        )
      }
      acc[dataState.key] = dataState.handler
    }
  }
  traverse(dataState)
  return acc
}

export function handler(func: (args: any) => any): ServerHandlerEventDataState {
  const key = crypto.randomUUID()
  return {
    $: 'event',
    key,
    async: false,
    handler: func,
  }
}

export function asyncHandler(func: (args: any) => Promise<any>): ServerHandlerEventDataState {
  const key = crypto.randomUUID()
  return {
    $: 'event',
    key,
    async: true,
    handler: func,
  }
}
