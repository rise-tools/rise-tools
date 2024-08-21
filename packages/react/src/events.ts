import { ActionModelState, HandlerFunction, StateModelState } from './rise'

export type EventModelState = {
  $: 'event'
  actions?: ActionModelState[]
  timeout?: number
  args?: Record<string, StateModelState<any>>
}
export type ServerEventModelState<
  Args extends any[] = any[],
  ReturnType = void,
> = EventModelState & {
  handler: HandlerFunction<Args, ReturnType>
}

export function isEventModelState(obj: any): obj is EventModelState {
  return obj !== null && typeof obj === 'object' && obj.$ === 'event'
}

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
