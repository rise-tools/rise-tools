import React from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

import { EventModelState, isEventModelState, ServerEventModelState } from './events'

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
  | { [key: string]: ModelState<T>; $?: never }
  | Iterable<ModelState<T>>
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

export function isCompositeModelState(obj: any): obj is ComponentModelState | ReferencedModelState {
  return obj !== null && typeof obj === 'object' && (obj.$ === 'component' || obj.$ === 'ref')
}
export function isComponentModelState(obj: any): obj is ComponentModelState<any> {
  return obj !== null && typeof obj === 'object' && obj.$ === 'component'
}
export function isReferencedComponentModelState(obj: any): obj is ReferencedComponentModelState {
  return isComponentModelState(obj) && 'path' in obj
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
  function renderComponent({ stateNode, path }: { stateNode: ComponentModelState; path: Path }) {
    const componentDefinition =
      CORE_COMPONENTS[stateNode.component] || components[stateNode.component]
    if (!componentDefinition) {
      throw new RenderError(`Unknown component: ${stateNode.component}`)
    }

    const Component = componentDefinition.component
    if (!Component) {
      throw new RenderError(`Invalid component: ${stateNode.component}`)
    }

    let componentProps = Object.fromEntries(
      Object.entries(stateNode.props || {}).map(([propKey, propValue]) => {
        return [propKey, renderProp(propKey, propValue, stateNode, [...path, 'props', propKey])]
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
  }

  function render(stateNode: ModelState, path: Path): React.ReactNode {
    if (stateNode === null || typeof stateNode !== 'object') {
      return stateNode
    }
    if (Symbol.iterator in stateNode) {
      return Array.from(stateNode).map((item, idx) =>
        render(item, [...path, itemKeyOrIndex(item, idx)])
      )
    }
    if (!isCompositeModelState(stateNode)) {
      throw new Error('Objects are not valid as a React child.')
    }
    if (stateNode.$ === 'component') {
      return renderComponent({
        stateNode,
        path: isReferencedComponentModelState(stateNode) ? stateNode.path : path,
      })
    }
    if (stateNode.$ === 'ref') {
      throw new Error('Your data includes refs. You must use a <Rise /> component instead.')
    }
  }

  function renderProp(
    propKey: string,
    propValue: ModelState,
    parentNode: ComponentModelState | ReferencedComponentModelState,
    path: Path
  ): any {
    if (propValue === null || typeof propValue !== 'object') {
      return propValue
    }
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
    if (Symbol.iterator in propValue) {
      return Array.from(propValue).map((item, idx) =>
        renderProp(propKey, item, parentNode, [...path, itemKeyOrIndex(item, idx)])
      )
    }
    if (isCompositeModelState(propValue)) {
      return render(propValue, path)
    }
    return Object.fromEntries(
      Object.entries(propValue).map(([key, value]) => {
        return [key, renderProp(key, value, parentNode, [...path, key])]
      })
    )
  }

  return <>{render(model, path)}</>
}

export class RenderError extends Error {}

const CORE_COMPONENTS: ComponentRegistry = {
  'rise-tools/react/Fragment': {
    component: React.Fragment,
  },
}
