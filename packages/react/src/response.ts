import {
  ActionModelState,
  EventResponse,
  isActionModelState,
  isActionModelStateArray,
} from './rise'

export function response(actions: ActionModelState | ActionModelState[]): EventResponse<any>
export function response<T>(
  payload: T,
  opts?: { actions?: ActionModelState[]; key?: string }
): EventResponse<T>
export function response<T>(
  payload?: T | ActionModelState | ActionModelState[],
  opts?: {
    actions?: ActionModelState[]
    key?: string
  }
): EventResponse<T> {
  if (isActionModelState(payload)) {
    return {
      $: 'evt-res',
      key: opts?.key || '',
      actions: [payload],
    }
  }
  if (isActionModelStateArray(payload)) {
    return {
      $: 'evt-res',
      key: opts?.key || '',
      actions: payload,
    }
  }
  if (!payload) {
    return {
      $: 'evt-res',
      key: opts?.key || '',
    }
  }
  return {
    $: 'evt-res',
    key: opts?.key || '',
    payload,
    actions: opts?.actions,
  }
}

export function errorResponse<T>(...args: Parameters<typeof response<T>>): EventResponse<T> {
  return {
    ...response(...args),
    error: true,
  }
}
