export type ViewModel<ViewState> = {
  type: 'view'
  load: () => Promise<ViewState>
  get: () => ViewState
  resolve: () => Promise<void>
  subscribe(listener: (newState: ViewState) => void): () => void
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
  load: () => Promise<Data>
  invalidate: () => void
  resolve: () => Promise<void>
  subscribe(listener: (newData: Data) => void): () => void
}

export type ValueModel<T> = ViewModel<T> | StateModel<T> | QueryModel<T> | (() => T)

export type AnyModels =
  | Record<string, ValueModel<any> | LookupModel<any>>
  | ValueModel<any>
  | LookupModel<any>
