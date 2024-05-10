import { ActionEventDataState, JSONValue } from './template'

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

export type ResponseDataState = {
  $: 'response'
  payload: JSONValue
  statusCode: number
  ok: boolean
  actions: ActionEventDataState[]
}

export type ServerResponseDataState = ResponseDataState & {
  action(action: ActionEventDataState): ServerResponseDataState
  status(code: number): ServerResponseDataState
}

export function isResponseDataState(obj: any): obj is ResponseDataState {
  return obj && typeof obj === 'object' && '$' in obj && obj.$ === 'response'
}
