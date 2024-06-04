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

export type LookupModel<Model extends AnyModels> = {
  type: 'lookup'
  get: (key: string) => Model | undefined
}

export type QueryModel<Data> = {
  type: 'query'
  get: () => Data | undefined
}

export type AnyModel = ViewModel<any> | StateModel<any> | LookupModel<any> | QueryModel<any>

export type AnyModels = Record<string, AnyModel> | AnyModel
