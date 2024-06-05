import {
  ActionDataState,
  HandlerFunction,
  isEventDataState,
  ServerEventDataState,
  StateDataState,
} from './template'

export function isServerEventDataState(obj: any): obj is ServerEventDataState {
  return isEventDataState(obj) && 'handler' in obj && typeof obj.handler === 'function'
}

export function event<T extends any[]>(
  func: HandlerFunction<T>,
  opts?: {
    actions?: ActionDataState[]
    timeout?: number
  }
): ServerEventDataState<T>
export function event<T>(
  func: HandlerFunction<[T]>,
  opts?: {
    actions?: ActionDataState[]
    timeout?: number
    args?: { [K in keyof T]: StateDataState<T[K]> }
  }
): ServerEventDataState<[T]> {
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
