import React from 'react'

/** Components */
type ComponentIdentifier = string

export type ComponentRegistry = Record<ComponentIdentifier, ComponentDefinition<any>>
export type ComponentDefinition<T extends Record<string, JSONValue>> = {
  component: React.ComponentType<T>
  validator?: (input?: T) => T
}

/* Component props */
export type TemplateComponentProps<T> = {
  [P in keyof T]: T[P] extends EventDataStateProp | undefined ? (...args: any[]) => void : T[P]
}

/** Data state */
export type DataState = ComponentDataState | ReferencedDataState | EventDataState

export type ComponentDataState = {
  $: 'component'
  key?: string
  component: ComponentIdentifier
  children?: JSONValue
  props?: Record<string, JSONValue>
}
export type ReferencedDataState = {
  $: 'ref'
  ref: string | [string, ...(string | number)[]]
}
// tbd: allow for more specific types
type EventDataState = {
  $: 'event'
  action?: any
}
export type EventDataStateProp = EventDataState | EventDataState[]
type SafeObject = {
  [key: string]: JSONValue
  // @ts-expect-error
  $?: never
}
export type JSONValue = DataState | SafeObject | string | number | boolean | null | JSONValue[]

export type TemplateEvent<T = any, K = any> = {
  target: {
    key?: string
    path: string
    component: string
  }
  name: string
  action: T
  payload: K
}

export function isCompositeDataState(obj: any): obj is ComponentDataState | ReferencedDataState {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    '$' in obj &&
    (obj.$ === 'component' || obj.$ === 'ref')
  )
}

function isEventDataState(obj: any): obj is EventDataState {
  return obj !== null && typeof obj === 'object' && '$' in obj && obj.$ === 'event'
}

export function BaseTemplate({
  components,
  dataState,
  onEvent,
}: {
  components: ComponentRegistry
  dataState: JSONValue
  onEvent?: (event: TemplateEvent) => void
}) {
  function renderComponent(stateNode: ComponentDataState, path: string) {
    const componentDefinition = components[stateNode.component]
    if (!componentDefinition) {
      throw new RenderError(`Unknown component: ${stateNode.component}`)
    }

    // tbd: validate `components` prop once with `zod` instead of later render stage
    const Component = componentDefinition.component
    if (!Component) {
      throw new RenderError(`Invalid component: ${stateNode.component}`)
    }

    let componentProps = stateNode.props || {}

    if (typeof componentDefinition.validator === 'function') {
      try {
        componentProps = componentDefinition.validator(stateNode.props)
      } catch (e) {
        throw new RenderError(
          `Invalid props for component: ${stateNode.component}, props: ${JSON.stringify(stateNode.props)}. Error: ${JSON.stringify(e)}`
        )
      }
    }

    const renderedProps = Object.fromEntries(
      Object.entries(componentProps).map(([propKey, propValue]) => {
        return [propKey, renderProp(propKey, propValue, stateNode, path)]
      })
    )

    const children = stateNode.children ? render(stateNode.children, `${path}.children`) : null

    return <Component key={path} data-testid={path} {...renderedProps} children={children} />
  }

  function render(stateNode: JSONValue, path: string, index?: number): React.ReactNode {
    if (stateNode === null || typeof stateNode !== 'object') {
      return stateNode
    }
    if (Array.isArray(stateNode)) {
      return stateNode.map((item, index) => render(item, path, index))
    }
    if (!isCompositeDataState(stateNode)) {
      throw new Error('Objects are not valid as a React child.')
    }
    if (stateNode.$ === 'component') {
      const key = stateNode.key || index?.toString()
      return renderComponent(stateNode, key ? `${path}[${key}]` : path)
    }
    if (stateNode.$ === 'ref') {
      throw new Error('Your data includes refs. You must use a <Template /> component instead.')
    }
  }

  function renderProp(
    propKey: string,
    stateNode: JSONValue,
    parentNode: ComponentDataState,
    path: string
  ): any {
    if (
      isEventDataState(stateNode) ||
      (Array.isArray(stateNode) && stateNode.length > 0 && stateNode.every(isEventDataState))
    ) {
      return (payload: any) => {
        const nodes = Array.isArray(stateNode) ? stateNode : [stateNode]
        for (const node of nodes) {
          // React events (e.g. from onPress) contain cyclic structures that can't be serialized
          // with JSON.stringify and also provide little to no value for the server.
          // tbd: figure a better way to handle this in a cross-platform way
          if (payload?.nativeEvent) {
            payload = '[native code]'
          }
          onEvent?.({
            target: { key: parentNode.key, path, component: parentNode.component },
            name: propKey,
            action: node.action,
            payload,
          })
        }
      }
    }
    if (Array.isArray(stateNode)) {
      return stateNode.map((item, index) =>
        renderProp(propKey, item, parentNode, `${path}.props[${propKey}][${index}]`)
      )
    }
    if (isCompositeDataState(stateNode)) {
      return render(stateNode, `${path}.props[${propKey}]`)
    }
    if (stateNode && typeof stateNode === 'object') {
      return Object.fromEntries(
        Object.entries(stateNode).map(([key, value]) => {
          return [
            key,
            renderProp(`${propKey}.${key}`, value, parentNode, `${path}.props[${propKey}][${key}]`),
          ]
        })
      )
    }
    return stateNode
  }

  return <ErrorBoundary>{render(dataState, 'root')}</ErrorBoundary>
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
