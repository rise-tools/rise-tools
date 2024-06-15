import {
  ActionModelState,
  HandlerFunction,
  isEventModelState,
  ServerEventModelState,
  StateModelState,
} from './rise'

export function isServerEventModelState(obj: any): obj is ServerEventModelState {
  return isEventModelState(obj) && 'handler' in obj && typeof obj.handler === 'function'
}

export function event<T>(
  func: HandlerFunction<[T]>,
  opts?: {
    actions?: ActionModelState[]
    timeout?: number
    args?: { [K in keyof T]: StateModelState<T[K]> }
  }
): ServerEventModelState<[T]> {
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
): ActionModelState<T, K> {
  return {
    ...options,
    $: 'action',
    name,
  }
}
