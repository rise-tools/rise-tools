// This file in the future will be part of JSX support
import crypto from 'node:crypto'

import {
  AsyncHandlerEventDataState,
  HandlerEventDataState,
  isComponentDataState,
  isHandlerEventDataState,
  JSONValue,
} from './template'

export function getAllEventHandlers(dataState: JSONValue) {
  const acc: Record<string, (args: any) => any> = {}
  function traverse(dataState: JSONValue) {
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
    if (isHandlerEventDataState(dataState)) {
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

export function handler(func: (args: any) => any): HandlerEventDataState {
  const key = crypto.randomUUID()
  return {
    $: 'event',
    key,
    async: false,
    handler: func,
  }
}

export function asyncHandler(func: (args: any) => Promise<any>): AsyncHandlerEventDataState {
  const key = crypto.randomUUID()
  return {
    $: 'event',
    key,
    async: true,
    handler: func,
  }
}
