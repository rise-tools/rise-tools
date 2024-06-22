import {
  ActionModelState,
  isActionModelState,
  isActionModelStateArray,
  ResponseModelState,
} from './rise'

export function response(actions: ActionModelState | ActionModelState[]): ResponseModelState<any>
export function response<T>(
  payload: T,
  opts?: { actions?: ActionModelState[] }
): ResponseModelState<T>
export function response<T>(
  payload?: T | ActionModelState | ActionModelState[],
  opts?: {
    actions?: ActionModelState[]
  }
): ResponseModelState<T> {
  if (isActionModelState(payload)) {
    return {
      $: 'response',
      actions: [payload],
    }
  }
  if (isActionModelStateArray(payload)) {
    return {
      $: 'response',
      actions: payload,
    }
  }
  if (!payload) {
    return {
      $: 'response',
    }
  }
  return {
    $: 'response',
    payload,
    actions: opts?.actions,
  }
}

export function errorResponse<T>(...args: Parameters<typeof response<T>>): ResponseModelState<T> {
  return {
    ...response(...args),
    error: true,
  }
}
