import React, { useCallback, useContext } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

import { LocalState, useLocalStateValues } from './state'
import { useStream } from './streams'

/** Components */
type ComponentIdentifier = string

export type ComponentRegistry = Record<ComponentIdentifier, ComponentDefinition<any>>
export type ComponentDefinition<T extends Record<string, JSONValue>> = {
  component: React.ComponentType<T>
  validator?: (input?: T) => T
}

/** Model state */
export type ModelState<T = EventModelState> =
  | JSONValue
  | ReferencedComponentModelState<T>
  | ComponentModelState<T>
  | ReferencedModelState
  | HandlerModelState<T>
  | StateModelState
  | { [key: string]: ModelState<T>; $?: never }
  | ModelState<T>[]
  | T
/** Server data state */
export type ServerModelState = ModelState<ServerEventModelState>
export type ServerHandlerModelState<
  Args extends any[] = any[],
  ReturnType = void,
> = HandlerModelState<ServerEventModelState<Args, ReturnType>>

export type ComponentModelState<T = EventModelState> = {
  $: 'component'
  key?: string
  component: ComponentIdentifier
  children?: ModelState<T>
  props?: Record<string, ModelState<T>>
  $staticChildren?: boolean
}
type ReferencedComponentModelState<T = EventModelState> = ComponentModelState<T> & {
  path: Path
}
export type StateModelState<T = JSONValue> = {
  $: 'state'
  key: string
  initialValue: T
}
export type Path = [string, ...(string | number)[]]
export type ReferencedModelState = {
  $: 'ref'
  ref: Path
}
export type ActionModelState<
  T extends string = string,
  K extends Record<string, any> = Record<string, any>,
> = {
  $: 'action'
  name: T
} & K
type ActionPayload<T> = Omit<T, '$' | 'name'>
export type ActionsDefinition<Actions extends Array<ActionModelState>> =
  Actions extends Array<infer Action>
    ? Action extends ActionModelState<infer ActionName>
      ? {
          [Key in ActionName]: {
            action: (payload: ActionPayload<Action>) => void
            validate?: (args: unknown) => ActionPayload<Action>
          }
        }
      : never
    : never

export type EventResponse<T> = {
  $: 'evt-res'
  key: string
  payload?: T
  error?: boolean
  actions?: ActionModelState[]
}

export type HandlerFunction<Args extends any[] = any[], ReturnType = void> = (
  ...args: Args
) => Promise<EventResponse<ReturnType> | ReturnType> | EventResponse<ReturnType> | ReturnType

export type EventModelState = {
  $: 'event'
  actions?: ActionModelState[]
  timeout?: number
  args?: Record<string, StateModelState<any>>
}
export type ServerEventModelState<
  Args extends any[] = any[],
  ReturnType = void,
> = EventModelState & {
  handler: HandlerFunction<Args, ReturnType>
}
export type JSONValue =
  | { [key: string]: JSONValue; $?: never }
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONValue[]

export type EventRequest<P = EventModelState | ActionModelState[], K = any[]> = {
  $: 'evt'
  key: string
  target: {
    key?: string
    component: string
    propKey: string
    path: Path
  }
  modelState: P
  payload: K
}

export type HandlerEvent = EventRequest<EventModelState>
export type HandlerModelState<T = EventModelState> = T | ActionModelState | ActionModelState[]

export function isCompositeModelState(
  obj: any
): obj is ComponentModelState | ReferencedModelState | StateModelState {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    (obj.$ === 'component' || obj.$ === 'ref' || obj.$ === 'state')
  )
}
export function isComponentModelState(obj: any): obj is ComponentModelState<any> {
  return obj !== null && typeof obj === 'object' && obj.$ === 'component'
}
export function isReferencedComponentModelState(obj: any): obj is ReferencedComponentModelState {
  return isComponentModelState(obj) && 'path' in obj
}
export function isEventModelState(obj: any): obj is EventModelState {
  return obj !== null && typeof obj === 'object' && obj.$ === 'event'
}
export function isHandlerEvent(obj: EventRequest): obj is HandlerEvent {
  return isEventModelState(obj.modelState)
}
export function isActionModelState(obj: any): obj is ActionModelState {
  return obj !== null && typeof obj === 'object' && obj.$ === 'action'
}
export function isActionModalStateContainingArray(obj: any): obj is any[] {
  return Array.isArray(obj) && obj.some(isActionModelState)
}
export function isActionModelStateArray(obj: any): obj is ActionModelState[] {
  return Array.isArray(obj) && obj.every(isActionModelState)
}
export function isEventResponse(obj: any): obj is EventResponse<any> {
  return obj && typeof obj === 'object' && obj.$ === 'evt-res'
}
function isStateModelState(obj: any): obj is StateModelState {
  return obj !== null && typeof obj === 'object' && obj.$ === 'state'
}
function itemKeyOrIndex(item: ModelState, idx: number): string | number {
  if (isComponentModelState(item)) {
    return item.key || idx
  }
  return idx
}

export function BaseRise({
  path = [''],
  components,
  model,
  onEvent,
}: {
  path?: Path
  components: ComponentRegistry
  model: ModelState
  onEvent?: (event: EventRequest) => any
}) {
  const RenderComponent = useCallback(
    function ({ stateNode, path }: { stateNode: ComponentModelState; path: Path }) {
      const componentDefinition =
        CORE_COMPONENTS[stateNode.component] || components[stateNode.component]
      if (!componentDefinition) {
        throw new RenderError(`Unknown component: ${stateNode.component}`)
      }

      const Component = componentDefinition.component
      if (!Component) {
        throw new RenderError(`Invalid component: ${stateNode.component}`)
      }

      const getLocalStateValue = useLocalStateValues()
      let componentProps = Object.fromEntries(
        Object.entries(stateNode.props || {}).map(([propKey, propValue]) => {
          return [
            propKey,
            renderProp(propKey, propValue, stateNode, getLocalStateValue, [
              ...path,
              'props',
              propKey,
            ]),
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
      const jsxFactory = stateNode.$staticChildren ? jsxs : jsx
      return jsxFactory(Component, {
        ...componentProps,
        children: render(stateNode.children, [...path, 'children']),
      })
    },
    [components]
  )

  function RenderState({ stateNode, path }: { stateNode: StateModelState; path: Path }) {
    const localState = useContext(LocalState)
    const value = useStream(localState.getStream(stateNode))
    return render(value, path)
  }

  function render(stateNode: ModelState, path: Path): React.ReactNode {
    if (stateNode === null || typeof stateNode !== 'object') {
      return stateNode
    }
    if (Array.isArray(stateNode)) {
      return stateNode.map((item, idx) => render(item, [...path, itemKeyOrIndex(item, idx)]))
    }
    if (!isCompositeModelState(stateNode)) {
      throw new Error('Objects are not valid as a React child.')
    }
    if (stateNode.$ === 'component') {
      return (
        <RenderComponent
          key={stateNode.key}
          stateNode={stateNode}
          path={isReferencedComponentModelState(stateNode) ? stateNode.path : path}
        />
      )
    }
    if (stateNode.$ === 'state') {
      return <RenderState stateNode={stateNode} path={path} />
    }
    if (stateNode.$ === 'ref') {
      throw new Error('Your data includes refs. You must use a <Rise /> component instead.')
    }
  }

  function renderProp(
    propKey: string,
    propValue: ModelState,
    parentNode: ComponentModelState | ReferencedComponentModelState,
    getLocalStateValue: (state: StateModelState) => JSONValue,
    path: Path
  ): any {
    if (
      isEventModelState(propValue) ||
      isActionModelState(propValue) ||
      isActionModalStateContainingArray(propValue)
    ) {
      if (Array.isArray(propValue) && !isActionModelStateArray(propValue)) {
        throw new RenderError(
          `Invalid props for component: ${parentNode.component}, props: ${propKey}. Arrays containing a mix of actions and other values are not supported.`
        )
      }
      return async (...payload: any[]) => {
        // React events (e.g. from onPress) contain cyclic structures that can't be serialized
        // with JSON.stringify and also provide little to no value for the server.
        // tbd: figure a better way to handle this in a cross-platform way
        payload = payload.map((arg) => (arg?.nativeEvent ? '[native code]' : arg))
        const modelState = isActionModelState(propValue) ? [propValue] : propValue
        const key = (Date.now() * Math.random()).toString(16)
        return onEvent?.({
          $: 'evt',
          key,
          target: {
            key: parentNode.key,
            component: parentNode.component,
            propKey,
            path,
          },
          modelState,
          payload,
        })
      }
    }
    if (Array.isArray(propValue)) {
      return propValue.map((item, idx) =>
        renderProp(propKey, item, parentNode, getLocalStateValue, [
          ...path,
          itemKeyOrIndex(item, idx),
        ])
      )
    }
    if (isStateModelState(propValue)) {
      return renderProp(
        propKey,
        getLocalStateValue(propValue),
        parentNode,
        getLocalStateValue,
        path
      )
    }
    if (isCompositeModelState(propValue)) {
      return render(propValue, path)
    }
    if (propValue && typeof propValue === 'object') {
      return Object.fromEntries(
        Object.entries(propValue).map(([key, value]) => {
          return [key, renderProp(key, value, parentNode, getLocalStateValue, [...path, key])]
        })
      )
    }
    return propValue
  }

  return <>{render(model, path)}</>
}

export class RenderError extends Error {}

const CORE_COMPONENTS: ComponentRegistry = {
  'rise-tools/react/Fragment': {
    component: React.Fragment,
  },
}
