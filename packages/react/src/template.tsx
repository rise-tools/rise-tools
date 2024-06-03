import React, { useCallback, useContext } from 'react'

import { LocalState } from './state'

/** Components */
type ComponentIdentifier = string

export type ComponentRegistry = Record<ComponentIdentifier, ComponentDefinition<any>>
export type ComponentDefinition<T extends Record<string, JSONValue>> = {
  component: React.ComponentType<T>
  validator?: (input?: T) => T
}

/** Data state */
export type DataState<T = never> =
  | JSONValue
  | ReferencedComponentDataState<T>
  | ComponentDataState<T>
  | ReferencedDataState
  | ActionDataState
  | EventDataState
  | StateDataState
  | { [key: string]: DataState<T>; $?: never }
  | DataState[]
  | T
export type ComponentDataState<T = never> = {
  $: 'component'
  key?: string
  component: ComponentIdentifier
  children?: DataState<T>
  props?: Record<string, DataState<T>>
}
type ReferencedComponentDataState<T = never> = ComponentDataState<T> & {
  path: Path
}
export type StateDataState<T = JSONValue> = {
  $: 'state'
  key: string
  initialValue: T
}
export type Path = [string, ...(string | number)[]]
export type ReferencedDataState = {
  $: 'ref'
  ref: Path
}
export type ActionDataState<T = any> = {
  $: 'action'
  name: T
}
export type ResponseDataState = {
  $: 'response'
  payload: JSONValue
  statusCode: number
  ok: boolean
  actions: ActionDataState[]
}
export type HandlerDataState = {
  $: 'handler'
  state: Record<string, StateDataState>
}
export type HandlerReturnType = ResponseDataState | JSONValue | void
export type HandlerFunction<T = any> = (args: T) => Promise<HandlerReturnType> | HandlerReturnType
export type EventDataState = {
  $: 'event'
  actions?: ActionDataState[]
  timeout?: number
  args?: Record<string, StateDataState>
}
export type ServerEventDataState = EventDataState & {
  handler: HandlerFunction
}

export type JSONValue =
  | { [key: string]: JSONValue; $?: never }
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONValue[]

export type TemplateEvent<P = EventDataState | ActionDataState[], K = any> = {
  target: {
    key?: string
    component: string
    propKey: string
    path: Path
  }
  dataState: P
  payload: K
}

export type HandlerEvent = TemplateEvent<EventDataState>

export function isCompositeDataState(
  obj: any
): obj is ComponentDataState | ReferencedDataState | StateDataState {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    (obj.$ === 'component' || obj.$ === 'ref' || obj.$ === 'state')
  )
}
export function isComponentDataState(obj: any): obj is ComponentDataState<any> {
  return obj !== null && typeof obj === 'object' && obj.$ === 'component'
}
export function isReferencedComponentDataState(
  obj: DataState
): obj is ReferencedComponentDataState {
  return isComponentDataState(obj) && 'path' in obj
}
export function isEventDataState(obj: any): obj is EventDataState {
  return obj !== null && typeof obj === 'object' && obj.$ === 'event'
}
export function isHandlerEvent(obj: TemplateEvent): obj is HandlerEvent {
  return isEventDataState(obj.dataState)
}
export function isServerHandlerDataState(obj: any): obj is ServerHandlerDataState {
  return isHandlerDataState(obj) && 'func' in obj && obj.func === 'function'
}
export function isActionDataState(obj: any): obj is ActionDataState {
  return obj !== null && typeof obj === 'object' && obj.$ === 'action'
}
export function isActionDataStateArray(obj: any): obj is ActionDataState[] {
  return Array.isArray(obj) && obj.every(isActionDataState)
}
export function isResponseDataState(obj: any): obj is ResponseDataState {
  return obj && typeof obj === 'object' && obj.$ === 'response'
}
export function isHandlerDataState(obj: any): obj is HandlerDataState {
  return obj && typeof obj === 'object' && obj.$ === 'handler'
}
function isStateDataState(obj: any): obj is StateDataState {
  return obj !== null && typeof obj === 'object' && obj.$ === 'state'
}
function itemKeyOrIndex(item: DataState, idx: number): string | number {
  if (isComponentDataState(item)) {
    return item.key || idx
  }
  return idx
}

export function BaseTemplate({
  path = [''],
  components,
  dataState,
  onTemplateEvent,
}: {
  path?: Path
  components: ComponentRegistry
  dataState: DataState
  onTemplateEvent?: (event: TemplateEvent) => any
}) {
  const RenderComponent = useCallback(
    function ({ stateNode, path }: { stateNode: ComponentDataState; path: Path }) {
      const componentDefinition = components[stateNode.component]
      if (!componentDefinition) {
        throw new RenderError(`Unknown component: ${stateNode.component}`)
      }

      const Component = componentDefinition.component
      if (!Component) {
        throw new RenderError(`Invalid component: ${stateNode.component}`)
      }

      const localState = useContext(LocalState)
      let componentProps = Object.fromEntries(
        Object.entries(stateNode.props || {}).map(([propKey, propValue]) => {
          return [
            propKey,
            renderProp(propKey, propValue, stateNode, localState, [...path, 'props', propKey]),
          ]
        })
      )
      if (typeof componentDefinition.validator === 'function') {
        try {
          componentProps = componentDefinition.validator(componentProps)
        } catch (e) {
          throw new RenderError(
            `Invalid props for component: ${stateNode.component}, props: ${JSON.stringify(stateNode.props)}. Error: ${JSON.stringify(e)}`
          )
        }
      }
      return (
        <Component {...componentProps}>
          {render(stateNode.children, [...path, 'children'])}
        </Component>
      )
    },
    [components]
  )

  function RenderState({ stateNode, path }: { stateNode: StateDataState; path: Path }) {
    const state = useContext(LocalState)
    const value = state[stateNode.key] || stateNode.initialValue
    return render(value, path)
  }

  function render(stateNode: DataState, path: Path): React.ReactNode {
    if (stateNode === null || typeof stateNode !== 'object') {
      return stateNode
    }
    if (Array.isArray(stateNode)) {
      return stateNode.map((item, idx) => render(item, [...path, itemKeyOrIndex(item, idx)]))
    }
    if (!isCompositeDataState(stateNode)) {
      throw new Error('Objects are not valid as a React child.')
    }
    if (stateNode.$ === 'component') {
      return (
        <RenderComponent
          key={stateNode.key}
          stateNode={stateNode}
          path={isReferencedComponentDataState(stateNode) ? stateNode.path : path}
        />
      )
    }
    if (stateNode.$ === 'state') {
      return <RenderState stateNode={stateNode} path={path} />
    }
    if (stateNode.$ === 'ref') {
      throw new Error('Your data includes refs. You must use a <Template /> component instead.')
    }
  }

  function renderProp(
    propKey: string,
    propValue: DataState,
    parentNode: ComponentDataState | ReferencedComponentDataState,
    localState: LocalState,
    path: Path
  ): any {
    if (
      isEventDataState(propValue) ||
      isActionDataState(propValue) ||
      isActionDataStateArray(propValue)
    ) {
      return async (payload: any) => {
        // React events (e.g. from onPress) contain cyclic structures that can't be serialized
        // with JSON.stringify and also provide little to no value for the server.
        // tbd: figure a better way to handle this in a cross-platform way
        if (payload?.nativeEvent) {
          payload = '[native code]'
        }
        if (isEventDataState(propValue) && isHandlerDataState(propValue.handler)) {
          payload = Object.fromEntries(
            Object.entries(propValue.handler.state).map(([key, value]) => {
              return [key, localState[value.key] || value.initialValue]
            })
          )
        }
        const dataState = isActionDataState(propValue) ? [propValue] : propValue
        return onTemplateEvent?.({
          target: {
            key: parentNode.key,
            component: parentNode.component,
            propKey,
            path,
          },
          dataState,
          payload,
        })
      }
    }
    if (Array.isArray(propValue)) {
      return propValue.map((item, idx) =>
        renderProp(propKey, item, parentNode, localState, [...path, itemKeyOrIndex(item, idx)])
      )
    }
    if (isStateDataState(propValue)) {
      return render(localState[propValue.key] || propValue.initialValue, path)
    }
    if (isCompositeDataState(propValue)) {
      return render(propValue, path)
    }
    if (propValue && typeof propValue === 'object') {
      return Object.fromEntries(
        Object.entries(propValue).map(([key, value]) => {
          return [key, renderProp(key, value, parentNode, localState, [...path, key])]
        })
      )
    }
    return propValue
  }

  return <>{render(dataState, path)}</>
}

export class RenderError extends Error {}
