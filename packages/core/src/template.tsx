import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { Text } from 'react-native'

export type Store<V = unknown> = {
  get: () => V
  subscribe: (handler: () => void) => () => void
}

export type DataSource = {
  get: (key: string) => Store
  // sendEvent?: (path: string, name: string, value: any) => void;
}

export function useStore(store: Store) {
  return useSyncExternalStore(store.subscribe, store.get)
}

/** Data */
type DataState = ComponentDataState | ReferencedDataState
enum DataStateType {
  Component = 'component',
  Ref = 'ref',
}
function isDataState(value: any): value is DataState {
  return value && typeof value === 'object' && '$' in value
}

/** Components */
type ComponentRegistry = Record<ComponentIdentifier, ComponentDefinition>
type ComponentIdentifier = string
type ComponentDefinition<Props extends ComponentProps = ComponentProps> = {
  component: React.ComponentType<
    React.PropsWithChildren<object> & {
      onTemplateEvent: (name: string, payload: any) => void
    }
  >
  validator?: (input: Props) => Props
}

type ComponentProp = ComponentProp[] | string | boolean | DataState | null | undefined
type ComponentProps = Record<string, ComponentProp>
type ComponentDataState = {
  $: DataStateType.Component
  key: string
  component: ComponentIdentifier
  children: ComponentProp
  props: ComponentProps
}

/** Refs */
type RefsRecord = Record<string, PropDataState | null>
type RefLookup = string | [string, ...(string | number)[]]
type ReferencedDataState = {
  key: string
  $: DataStateType.Ref
  ref: RefLookup
}

function extractRefValue(dataValues: Record<string, DataState | null>, ref: RefLookup) {
  if (typeof ref === 'string') return dataValues[ref]
  if (Array.isArray(ref)) {
    const [refKey, ...rest] = ref
    let lookupValue = dataValues[refKey]
    rest.forEach((key) => {
      if (lookupValue && typeof lookupValue === 'object') {
        lookupValue = lookupValue[key]
      }
    })
    return lookupValue
  }
  return null
}
function extractRefKey(ref: RefLookup) {
  if (typeof ref === 'string') return ref
  if (Array.isArray(ref)) {
    return ref[0]
  }
  return null
}

function findAllRefs(rootNodeState: DataState, refValues: RefsRecord): Set<string> {
  const currentRefKeys = new Set<string>()
  function searchRefs(state: DataState) {
    if (Array.isArray(state)) {
      state.forEach(searchRefs)
      return
    }
    if (!state || typeof state !== 'object') return
    if (state.$ === 'ref') {
      const refKey = extractRefKey(state.ref)
      if (!refKey) return
      currentRefKeys.add(refKey)
      const lastValue = refValues[refKey]
      if (lastValue) searchRefs(lastValue)
      return
    }
    if (state.$ === 'component') {
      if (Array.isArray(state.children)) {
        state.children.forEach(searchRefs)
      }
      if (state.props) {
        Object.entries(state.props).forEach(([, value]) => {
          searchRefs(value)
        })
      }
      return
    }
    Object.values(state).forEach(searchRefs)
  }
  searchRefs(rootNodeState)

  return currentRefKeys
}

function createRefStateManager(
  setDataValues: Dispatch<SetStateAction<RefsRecord>>,
  dataSource: DataSource,
  rootKey: string
) {
  let refsState: RefsRecord = {
    [rootKey]: dataSource.get(rootKey).get(),
  }
  let refSubscriptions: Record<string, () => void> = {}
  function setRefValue(refKey: string, value: PropDataState) {
    if (refsState[refKey] !== value) {
      refsState = { ...refsState, [refKey]: value }
      setDataValues(refsState)
      return true
    }
    return false
  }
  function ensureSubscription(key: string) {
    if (!refSubscriptions[key]) {
      const refValueProvider = dataSource.get(key)
      refSubscriptions[key] = refValueProvider.subscribe(() => {
        const didUpdate = setRefValue(key, refValueProvider.get())
        if (didUpdate) {
          performSubscriptions()
        }
      })
      setRefValue(key, refValueProvider.get())
    }
  }
  function performSubscriptions() {
    ensureSubscription(rootKey)
    const rootState = dataSource.get(rootKey).get()
    const referencedRefs = findAllRefs(rootState, refsState)
    referencedRefs.add(rootKey)
    referencedRefs.forEach(ensureSubscription)
    Object.entries(refSubscriptions).forEach(([key, release]) => {
      if (!referencedRefs.has(key)) {
        release()
        delete refSubscriptions[key]
      }
    })
  }
  function releaseSubscriptions() {
    Object.values(refSubscriptions).forEach((release) => release())
    refSubscriptions = {}
    refsState = {}
  }
  return {
    activate() {
      performSubscriptions()
      return releaseSubscriptions
    },
  }
}

type RefStateManager = ReturnType<typeof createRefStateManager>

function isPrimitive(value: unknown) {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

function resolveValueRefs(dataValues: RefsRecord, value: DataState): DataState {
  if (isPrimitive(value)) return value
  if (Array.isArray(value)) {
    return value.map((item) => resolveValueRefs(dataValues, item))
  }
  if (typeof value === 'object') {
    if (value.$ === 'ref') {
      return resolveRef(dataValues, value.ref)
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        return [key, resolveValueRefs(dataValues, item)]
      })
    )
  }
}

function resolveRef(dataValues: RefsRecord, lookup: RefLookup): DataState {
  const value = extractRefValue(dataValues, lookup)
  return resolveValueRefs(dataValues, value)
}

export function Template({
  components,
  dataSource,
  onEvent,
  ...props
}: {
<<<<<<< HEAD
  components: Record<string, ComponentDefinition<{}>>
=======
  components: ComponentRegistry
  errorComponent: React.ReactNode
>>>>>>> a1275d9 (chore: rework template package)
  dataSource: DataSource
  onEvent: (key: string, name: string, payload: any) => void
  path: string
}) {
  const [dataValues, setDataValues] = useState<RefsRecord>({})
  const refStateManager = useRef<RefStateManager>(
    createRefStateManager(setDataValues, dataSource, props.path || '')
  )
  useEffect(() => {
    const release = refStateManager.current.activate()
    return () => release()
  }, [])

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

    const componentProps =
      typeof componentDefinition.validator === 'function'
        ? componentDefinition.validator(stateNode.props)
        : stateNode.props

    const props = Object.fromEntries(
      Object.entries(componentProps).map(([propKey, propValue]) => {
        return [propKey, render(propValue, `${path}.$props.${propKey}`)]
      })
    )

    const children = stateNode.children ? render(stateNode.children, path) : null
    return (
      <Component
        key={path}
        {...props}
        children={children}
        onTemplateEvent={(name: string, payload: any) => onEvent(path, name, payload)}
      />
    )
  }

  function render(stateNode: ComponentProp, path: string): React.ReactNode {
    if (stateNode === null || typeof stateNode !== 'object') {
      return stateNode
    }
    if (Array.isArray(stateNode)) {
      return stateNode.map((item, index) => {
        const childKey = isDataState(item) ? item.key : String(index)
        const childPath = path === '' ? childKey : `${path}.${childKey}`
        return render(item, childPath)
      })
    }
    if (stateNode.$ === DataStateType.Component) {
      return <ErrorBoundary>{renderComponent(stateNode, path)}</ErrorBoundary>
    }
    // tbd: what to do with ref
    throw new Error('ref is not supported as a prop yet.')
  }

  const rootNodeState = resolveRef(dataValues, props.path)
  return <>{render(rootNodeState, props.path)}</>
}

/** Error boundary */
class RenderError extends Error {}
class ErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  { error: RenderError | null }
> {
  static getDerivedStateFromError(error: RenderError) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <Text>Render error: {this.state.error.message}</Text>
    }

    return this.props.children
  }
}
