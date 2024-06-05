import {
  ActionDataState,
  HandlerFunction,
  isEventDataState,
  ServerEventDataState,
  ServerHandlerDataState,
  StateDataState,
} from './template'

export function isServerEventDataState(obj: any): obj is ServerEventDataState {
  return isEventDataState(obj) && 'handler' in obj && typeof obj.handler === 'function'
}

export function event<T>(
  func: HandlerFunction<T>,
  opts?: {
    actions?: ActionDataState[]
    timeout?: number
    args?: { [K in keyof T]: StateDataState<T[K]> }
  }
): ServerEventDataState {
  return {
    $: 'event',
    handler: func,
    actions: opts?.actions,
    timeout: opts?.timeout,
  }
}

export function action<T = any>(name: T): ActionDataState<T> {
  return {
    $: 'action',
    name,
  }
}

export function extend(
  handler: ServerHandlerDataState | HandlerFunction,
  action: ActionDataState | ActionDataState[]
): ServerHandlerDataState {
  if (typeof handler === 'function') {
    handler = event(handler)
  }
  if (isServerEventDataState(handler)) {
    if (!handler.actions) {
      handler.actions = []
    }
    handler.actions = handler.actions.concat(action)
    return handler
  }
  return Array.isArray(handler) ? handler.concat(action) : [handler].concat(action)
}
