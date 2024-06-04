import type { JSXElementConstructor, ReactElement } from 'react'

import { event } from './events'
import {
  ActionDataState,
  ComponentDataState,
  DataState,
  isComponentDataState,
  JSONValue,
  ReferencedDataState,
  ServerDataState,
  ServerEventDataState,
  StateDataState,
} from './template'

// tbd: refactor and unify this
type AllowedDataStates =
  | ServerEventDataState
  | ActionDataState
  | ReferencedDataState
  | StateDataState
  | ((args: any) => any)

type Props = Record<string, JSONValue | AllowedDataStates> & {
  children: DataState
}

export type UI = ReactElement<Props> | ComponentDataState<ServerDataState>

export const jsxs = jsx

export function jsx(
  componentFactory: (props: any) => UI,
  { children, ...passedProps }: Props,
  key?: string
): ComponentDataState<ServerDataState> {
  console.log(componentFactory)
  const el = componentFactory(passedProps)
  if (isComponentDataState(el)) {
    return el
  }
  if (typeof el.type !== 'string') {
    throw new Error('Invalid component. Make sure to use server-side version of your components.')
  }
  const serialisedProps = Object.fromEntries(
    Object.entries(el.props).map(([key, value]) => {
      if (typeof value === 'function') {
        return [key, event(value)]
      }
      return [key, value]
    })
  )
  return {
    $: 'component',
    component: el.type,
    key,
    props: serialisedProps,
    children,
  }
}

// tbd: this should be smarter
// only allow "ActionDataState" or "EventDataState" when prop extends function
// if takes React.Element, allow "ComponentDataState" or "ReferencedDataState"
// otherwise, allow "StateDataState"
type Extend<P, K> = {
  [Key in keyof P]: P[Key] extends object ? K | Extend<P[Key], K> : P[Key] | K
}

export function createComponentDefinition<
  T extends JSXElementConstructor<any> | keyof JSX.IntrinsicElements,
  P = React.ComponentProps<T>,
>(type: string) {
  return (props: Extend<P, AllowedDataStates>): ReactElement => ({
    type,
    props,
    key: null,
  })
}

export function isReactElement(obj: any): obj is ReactElement {
  return obj !== null && typeof obj === 'object' && 'type' in obj && 'props' in obj && 'key' in obj
}
