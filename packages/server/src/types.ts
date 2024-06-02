export type ViewModel<ViewState> = {
  type: 'view'
  get: () => ViewState
}

export type StateModel<State> = {
  type: 'state'
  get(): State
  subscribe(listener: (newState: State) => void): () => void
}
export type StateSetter<State> = (newState: State | ((state: State) => State)) => void

export type LookupModel<T> = {
  type: 'lookup'
  get: (key: string) => T | undefined
}

export type QueryModel<V> = {
  type: 'query'
}

export type AnyModel = ViewModel<any> | StateModel<any> | LookupModel<any> | QueryModel<any>

export type AnyModels = Record<string, AnyModel> | AnyModel
