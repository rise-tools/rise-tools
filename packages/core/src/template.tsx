import React, { ReactNode } from 'react'

export type Store<V = unknown> = {
  get: () => V
  subscribe: (handler: () => void) => () => void
}

export type DataSource = {
  get: (key: string) => Store
}

/** Data */
type DataState = ComponentDataState
// | ReferencedDataState
export enum DataStateType {
  Component = 'component',
  Ref = 'ref',
}

/** Components */
type ComponentIdentifier = string
export type ComponentRegistry = Record<ComponentIdentifier, ComponentDefinition>
export type ComponentDefinition<Props extends object = object> = {
  component: React.ComponentType<
    {
      onTemplateEvent: (name: string, payload: any) => void
      children: ReactNode
    } & Props
  >
  validator?: (input?: ComponentProps) => void
}

// tbd: we should allow objects as props too
type ComponentProp = ComponentProp[] | string | number | boolean | DataState | null | undefined
type ComponentProps = Record<string, ComponentProp>
type ComponentDataState = {
  $: DataStateType.Component
  key: string
  component: ComponentIdentifier
  children?: ComponentProp
  props?: ComponentProps
}

// tbd: needs a better name
export function BaseTemplate({
  components,
  dataState,
  onEvent,
}: {
  components: ComponentRegistry
  errorComponent: React.ReactNode
  dataState: DataState | DataState[]
  onEvent: (key: string, name: string, payload: any) => void
}) {
  function renderComponent(stateNode: ComponentDataState, key: string) {
    const componentDefinition = components[stateNode.component]
    if (!componentDefinition) {
      throw new RenderError(`Unknown component: ${stateNode.component}`)
    }

    // tbd: validate `components` prop once with `zod` instead of later render stage
    const Component = componentDefinition.component
    if (!Component) {
      throw new RenderError(`Invalid component: ${stateNode.component}`)
    }

    if (typeof componentDefinition.validator === 'function') {
      componentDefinition.validator(stateNode.props)
    }

    const props = Object.fromEntries(
      Object.entries(stateNode.props || {}).map(([propKey, propValue]) => {
        return [propKey, render(propValue, `${key}.$props`)]
      })
    )

    const children = stateNode.children ? render(stateNode.children, key) : null

    return (
      <Component
        data-testId={key}
        // tbd: should key be nested with parent, or should it equal to stateNode.key?
        // I guess we use it for communication with the parent, but also react rendering
        key={key}
        children={children}
        {...props}
        onTemplateEvent={(name, payload) => onEvent(key, name, payload)}
      />
    )
  }

  function render(stateNode: ComponentProp, parentKey?: string): React.ReactNode {
    if (stateNode === null || typeof stateNode !== 'object') {
      return stateNode
    }
    if (Array.isArray(stateNode)) {
      return stateNode.map((item) => render(item, parentKey))
    }
    if (stateNode.$ === DataStateType.Component) {
      return (
        <ErrorBoundary>
          {renderComponent(stateNode, parentKey ? `${parentKey}.${stateNode.key}` : stateNode.key)}
        </ErrorBoundary>
      )
    }
    // tbd: what to do with ref
    throw new Error('ref is not supported as a prop yet.')
  }

  return <>{render(dataState)}</>
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
