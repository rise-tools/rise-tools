import React from 'react'

/** Components */
type ComponentIdentifier = string
type ComponentProps = React.PropsWithChildren<{
  onTemplateEvent: (name: string, payload: any) => void
}>

export type ComponentRegistry = Record<ComponentIdentifier, ComponentDefinition<any>>
export type ComponentDefinition<Props> = {
  component: React.ComponentType<ComponentProps & Props>
  validator?: (input?: Record<string, DataState>) => void
}

/** Data state */
export enum DataStateType {
  Component = 'component',
  Ref = 'ref',
}
export type DataState =
  | DataState[]
  | ComponentDataState
  | ReferencedDataState
  | object
  | string
  | number
  | boolean
  | null
  | undefined

type ComponentDataState = {
  $: DataStateType.Component
  key?: string
  component: ComponentIdentifier
  children?: DataState
  props?: Record<string, DataState>
}
type ReferencedDataState = {
  $: DataStateType.Ref
  ref: string
}

export function isCompositeDataState(obj: any): obj is ComponentDataState | ReferencedDataState {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    '$' in obj &&
    (obj.$ === DataStateType.Component || obj.$ === DataStateType.Ref)
  )
}

// tbd: needs a better name
export function BaseTemplate({
  components,
  dataState,
  onEvent,
}: {
  components: ComponentRegistry
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
        return [propKey, renderProp(propValue, `${key}.props['${propKey}']`)]
      })
    )

    const children = stateNode.children ? render(stateNode.children, `${key}.children`) : null

    // workaround for https://github.com/microsoft/TypeScript/issues/17867
    const baseProps: ComponentProps = {
      children,
      onTemplateEvent(name, payload) {
        onEvent(key, name, payload)
      },
    }

    return <Component data-testid={key} key={key} {...props} {...baseProps} />
  }

  function render(stateNode: DataState, parentKey: string): React.ReactNode {
    if (stateNode === null || typeof stateNode !== 'object') {
      return stateNode
    }
    if (Array.isArray(stateNode)) {
      return stateNode.map((item, index) => render(item, `${parentKey}[${index}]`))
    }
    if (!isCompositeDataState(stateNode)) {
      throw new Error('Objects are not valid as a React child.')
    }
    if (stateNode.$ === DataStateType.Component) {
      return renderComponent(stateNode, stateNode.key || parentKey)
    }
    if (stateNode.$ === DataStateType.Ref) {
      throw new Error('Your data includes refs. You must use a <Template /> component instead.')
    }
  }

  function renderProp(stateNode: DataState, parentKey: string): DataState {
    if (Array.isArray(stateNode)) {
      return stateNode.map((item, index) => renderProp(item, `${parentKey}[${index}]`))
    }
    if (isCompositeDataState(stateNode)) {
      return render(stateNode, parentKey)
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
