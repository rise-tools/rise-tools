import {
  ActionModelState,
  HandlerReturnType,
  isActionModelState,
  isActionModelStateArray,
  ResponseModelState,
} from './rise'

export function response(
  payload?: HandlerReturnType,
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
