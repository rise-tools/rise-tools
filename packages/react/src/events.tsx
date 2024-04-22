// This file in the future will be part of JSX support
import crypto from 'node:crypto'

import { AsyncHandlerEventDataState, HandlerEventDataState, TemplateEvent } from './template'

type Handler = ((payload: any) => any) | ((payload: any) => Promise<any>)

const handlers = new Map<string, Handler>()

export function handler(func: Handler): AsyncHandlerEventDataState | HandlerEventDataState {
  const key = crypto.randomUUID()
  handlers.set(key, func)
  switch (func.constructor.name) {
    case 'AsyncFunction': {
      return {
        $: 'event',
        key,
        async: true,
      }
    }
    case 'Function': {
      return {
        $: 'event',
        key,
        async: false,
      }
    }
    default: {
      throw new Error(`Unhandled function type: ${func.constructor.name}`)
    }
  }
}

export async function handleEvent(
  event: TemplateEvent<AsyncHandlerEventDataState | HandlerEventDataState>
) {
  const handler = handlers.get(event.dataState.key)
  if (!handler) {
    throw new Error(`No handler found for key: ${event.target.key}`)
  }
  return await handler(event.payload)
}
