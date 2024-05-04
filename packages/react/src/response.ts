import { ActionEventDataState } from './template'

export type ServerHandlerResponse = any

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
  json(payload: any) {
    const res = new ServerResponse()
    res.payload = payload
    return res
  },
}

export class ServerResponse {
  actions: ActionEventDataState[] = []
  payload: any

  action(action: ActionEventDataState) {
    this.actions.push(action)
    return this
  }
}
