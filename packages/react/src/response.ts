import { ActionDataState, JSONValue, ResponseDataState } from './template'

export function response(payload: JSONValue): ServerResponseDataState {
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

export type ServerResponseDataState = ResponseDataState & {
  action(action: ActionDataState): ServerResponseDataState
  status(code: number): ServerResponseDataState
}
