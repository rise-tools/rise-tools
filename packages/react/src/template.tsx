import React from 'react'

/** Components */
type ComponentIdentifier = string

export type ComponentRegistry = Record<ComponentIdentifier, ComponentDefinition<any>>
export type ComponentDefinition<T extends Record<string, JSONValue>> = {
  component: React.ComponentType<T>
  validator?: (input?: T) => T
}

/** Data state */
export type DataState = JSONValue | ReferencedComponentDataState
export type ComponentDataState = {
  $: 'component'
  key?: string
  component: ComponentIdentifier
  children?: JSONValue
  props?: Record<string, JSONValue>
}
type ReferencedComponentDataState = ComponentDataState & {
  path: Path
}
export type Path = string | [string, ...(string | number)[]]
export type ReferencedDataState = {
  $: 'ref'
  ref: Path
}
type EventDataState = ActionEventDataState | HandlerEventDataState
export type ActionEventDataState<T = any> = {
  $: 'event'
  action?: T
}
export type HandlerEventDataState = {
  $: 'event'
  key: string
  async: boolean
}
export function isHandlerEvent(
  event: TemplateEvent
): event is TemplateEvent<HandlerEventDataState> {
  return isEventDataState(event.dataState) && 'key' in event.dataState
}
export function isActionEvent(event: TemplateEvent): event is TemplateEvent<ActionEventDataState> {
  return isEventDataState(event.dataState) && 'action' in event.dataState
}

type SafeObject = {
  [key: string]: JSONValue
  $?: never
}
export type JSONValue =
  | ComponentDataState
  | ReferencedDataState
  | EventDataState
  | SafeObject
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONValue[]

export type TemplateEvent<T = EventDataState, K = any> = {
  target: {
    key?: string
    component: string
    propKey: string
    path: Path
  }
  dataState: T
  payload: K
}
export type ActionEvent<T = any, K = any> = TemplateEvent<ActionEventDataState<T>, K>

export function isCompositeDataState(obj: any): obj is ComponentDataState | ReferencedDataState {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    '$' in obj &&
    (obj.$ === 'component' || obj.$ === 'ref')
  )
}
export function isComponentDataState(obj: JSONValue): obj is ComponentDataState {
  return obj !== null && typeof obj === 'object' && '$' in obj && obj.$ === 'component'
}
export function isReferencedComponentDataState(
  obj: JSONValue
): obj is ReferencedComponentDataState {
  return isComponentDataState(obj) && 'path' in obj
}
export function isEventDataState(obj: JSONValue): obj is EventDataState {
  return obj !== null && typeof obj === 'object' && '$' in obj && obj.$ === 'event'
}

export function BaseTemplate({
  path = '',
  components,
  dataState,
  onEvent,
}: {
  path?: Path
  components: ComponentRegistry
  dataState: JSONValue
  onEvent?: (event: TemplateEvent) => Promise<any>
}) {
  function renderComponent(stateNode: ComponentDataState, path: Path) {
    const componentDefinition = components[stateNode.component]
    if (!componentDefinition) {
      throw new RenderError(`Unknown component: ${stateNode.component}`)
    }

    // tbd: validate `components` prop once with `zod` instead of later render stage
    const Component = componentDefinition.component
    if (!Component) {
      throw new RenderError(`Invalid component: ${stateNode.component}`)
    }

    let componentProps = Object.fromEntries(
      Object.entries(stateNode.props || {}).map(([propKey, propValue]) => {
        return [propKey, renderProp(propKey, propValue, stateNode, path)]
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

    const children = stateNode.children ? render(stateNode.children, path) : null

    return <Component key={stateNode.key} {...componentProps} children={children} />
  }

  function render(stateNode: JSONValue, path: Path): React.ReactNode {
    if (stateNode === null || typeof stateNode !== 'object') {
      return stateNode
    }
    if (Array.isArray(stateNode)) {
      return stateNode.map((item) => render(item, path))
    }
    if (!isCompositeDataState(stateNode)) {
      throw new Error('Objects are not valid as a React child.')
    }
    if (stateNode.$ === 'component') {
      return renderComponent(
        stateNode,
        isReferencedComponentDataState(stateNode) ? stateNode.path : path
      )
    }
    if (stateNode.$ === 'ref') {
      throw new Error('Your data includes refs. You must use a <Template /> component instead.')
    }
  }

  function renderProp(
    propKey: string,
    propValue: JSONValue,
    parentNode: ComponentDataState | ReferencedComponentDataState,
    path: Path
  ): any {
    if (isEventDataState(propValue)) {
      return async (payload: any) => {
        // React events (e.g. from onPress) contain cyclic structures that can't be serialized
        // with JSON.stringify and also provide little to no value for the server.
        // tbd: figure a better way to handle this in a cross-platform way
        if (payload?.nativeEvent) {
          payload = '[native code]'
        }
        return onEvent?.({
          target: {
            key: parentNode.key,
            component: parentNode.component,
            propKey,
            path,
          },
          dataState: propValue,
          payload,
        })
      }
    }
    if (Array.isArray(propValue)) {
      return propValue.map((item) => renderProp(propKey, item, parentNode, path))
    }
    if (isCompositeDataState(propValue)) {
      return render(propValue, path)
    }
    if (propValue && typeof propValue === 'object') {
      return Object.fromEntries(
        Object.entries(propValue).map(([key, value]) => {
          return [key, renderProp(key, value, parentNode, path)]
        })
      )
    }
    return propValue
  }

  return <ErrorBoundary>{render(dataState, path)}</ErrorBoundary>
}

/** Error boundary */
class RenderError extends Error {}
class ErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  { error: RenderError | null }
> {
  constructor(props: React.PropsWithChildren<object>) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: RenderError) {
    return { error }
  }

  render() {
    if (this.state.error) {
      // tbd: render fallback ui
      return null
    }

    return this.props.children
  }
}
