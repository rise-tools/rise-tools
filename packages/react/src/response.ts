import {
  ActionModelState,
  isActionModelState,
  isActionModelStateArray,
  JSONValue,
  ResponseModelState,
} from './rise'

export function response(actions: ActionModelState | ActionModelState[]): ResponseModelState
export function response(
  payload: JSONValue,
  opts?: { actions?: ActionModelState[] }
): ResponseModelState
export function response(
  payload?: JSONValue | ActionModelState | ActionModelState[],
  opts?: {
    actions?: ActionModelState[]
  }
): ResponseModelState {
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

export function errorResponse(...args: Parameters<typeof response>): ResponseModelState {
  return {
    ...response(...args),
    error: true,
  }
}
