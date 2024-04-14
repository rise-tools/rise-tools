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
  [P in keyof T]: T[P] extends EventDataState | EventDataState[] | undefined
    ? (...args: any[]) => void
    : T[P]
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
type EventAction = any
type EventDataState = {
  $: 'event'
  action?: EventAction
}
type SafeObject = {
  [key: string]: JSONValue
  $?: never
}
export type JSONValue =
  | DataState
  | SafeObject
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONValue[]

export type TemplateEvent = {
  target: {
    key?: string
    path: string
  }
  name: string
  action?: EventDataState['action']
  payload: any[]
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
  dataState: JSONValue | JSONValue[]
  onEvent: (event: TemplateEvent) => void
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
      componentProps = componentDefinition.validator(stateNode.props)
    }

    const renderedProps = Object.fromEntries(
      Object.entries(componentProps).map(([propKey, propValue]) => {
        return [propKey, renderProp(propKey, propValue, stateNode, path)]
      })
    )

    const children = stateNode.children ? render(stateNode.children, `${path}.children`) : null

    return <Component data-testid={path} {...renderedProps} children={children} />
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
      (Array.isArray(stateNode) && stateNode.every(isEventDataState))
    ) {
      return (...payload: any[]) => {
        const nodes = Array.isArray(stateNode) ? stateNode : [stateNode]
        for (const node of nodes) {
          onEvent({
            target: { key: parentNode.key, path },
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
