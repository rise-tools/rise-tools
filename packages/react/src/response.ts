import { ActionModelState, JSONValue, ResponseModelState } from './rise'

export function response(payload: JSONValue): ServerResponseModelState {
  return {
    $: 'response',
    payload,
    // what are default values in `fetch`?
    statusCode: 200,
    ok: true,
    actions: [],
    action(action) {
      this.actions.push(action)
      return this
    },
    status(code: number) {
      this.statusCode = code
      this.ok = code >= 200 && code < 300
      return this
    },
  }
}

export type ServerResponseModelState = ResponseModelState & {
  action(action: ActionModelState): ServerResponseModelState
  status(code: number): ServerResponseModelState
}
