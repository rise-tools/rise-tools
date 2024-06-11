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
    args: opts?.args,
  }
}

export function action<T extends string, K extends Record<string, any>>(
  name: T,
  options: K = {} as K
): ActionDataState<T, K> {
  return {
    ...options,
    $: 'action',
    name,
  }
}
