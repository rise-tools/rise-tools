import React from 'react'

export type Store<V = unknown> = {
  get: () => V
  subscribe: (handler: () => void) => () => void
}

export type DataSource = {
  get: (key: string) => Store
}

/** Components */
type ComponentIdentifier = string
type BaseComponentProps = React.PropsWithChildren<{
  onTemplateEvent: (name: string, payload: any) => void
}>
export type ComponentRegistry = Record<ComponentIdentifier, ComponentDefinition<any>>
export type ComponentDefinition<Props> = {
  component: React.ComponentType<BaseComponentProps & Props>
  validator?: (input?: ComponentProps) => void
}

/** Data state */
type DataState = ComponentDataState | ReferencedDataState
export enum DataStateType {
  Component = 'component',
  Ref = 'ref',
}

type ComponentDataState = {
  $: DataStateType.Component
  key?: string
  component: ComponentIdentifier
  children?: ComponentProp
  props?: ComponentProps
}
type ReferencedDataState = {
  $: DataStateType.Ref
}
function isDataState(obj: any): obj is DataState {
  return (
    typeof obj === 'object' &&
    '$' in obj &&
    (obj.$ === DataStateType.Component || obj.$ === DataStateType.Ref)
  )
}

/* Props */
type ComponentProps = Record<string, ComponentProp>
type ComponentProp =
  | ComponentProp[]
  | DataState
  | object
  | string
  | number
  | boolean
  | null
  | undefined

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
    const baseProps: BaseComponentProps = {
      children,
      onTemplateEvent(name, payload) {
        onEvent(key, name, payload)
      },
    }

    return <Component data-testid={key} key={key} {...props} {...baseProps} />
  }

  function render(stateNode: ComponentProp, parentKey: string): React.ReactNode {
    if (stateNode === null || typeof stateNode !== 'object') {
      return stateNode
    }
    if (Array.isArray(stateNode)) {
      return stateNode.map((item, index) => render(item, `${parentKey}[${index}]`))
    }
    if (!isDataState(stateNode)) {
      throw new Error('Objects are not valid as a React child.')
    }
    if (stateNode.$ === DataStateType.Component) {
      return <ErrorBoundary>{renderComponent(stateNode, stateNode.key || parentKey)}</ErrorBoundary>
    }
    // tbd: what to do with ref
    throw new Error('ref is not supported as a prop yet.')
  }

  function renderProp(stateNode: ComponentProp, parentKey: string): ComponentProp {
    if (Array.isArray(stateNode)) {
      return stateNode.map((item, index) => renderProp(item, `${parentKey}[${index}]`))
    }
    if (isDataState(stateNode)) {
      return render(stateNode, parentKey)
    }
    return stateNode
  }

  return <>{render(dataState, 'root')}</>
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
