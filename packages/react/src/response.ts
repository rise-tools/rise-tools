import { ActionEventDataState, JSONValue } from './template'

// tbd
// what kind of API do we want?
// e.g. `res.json().action([])`
// or
// `return makeActionResponse()
// the implementation of this file will have to change based on the decision
// benefit of `json()` is we can support array buffers etc., and remove default JSON.stringify()
// called on the data-source send.
//
//
// The idea would be that by returning a special type of `Response`, we can also build some
// client-side hooks such as "onEvent()" where you can listen to e.g. global onError and display
// an appropriate error state
export const res = {
  json(payload: JSONValue) {
    const res = new ServerResponse()
    res.payload = payload
    return res
  },
}

export class ServerResponse {
  actions: ActionEventDataState[] = []
  payload: any

  // what are default values in `fetch`?
  statusCode: number = 200
  ok: boolean = true

  action(action: any) {
    this.actions.push({
      $: 'event',
      action,
    })
    return this
  }

  status(code: number) {
    this.statusCode = code
    this.ok = code >= 200 && code < 300
    return this
  }
}
