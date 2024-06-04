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

export type UI = ReactElement<Props> | ComponentDataState<ServerEventDataState>

export const jsxs = jsx

export function jsx(
  componentFactory: (props: any) => UI,
  { children, ...passedProps }: Props,
  key?: string
): ComponentDataState<ServerDataState> {
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

export type Extend<T> = { [P in keyof T]?: _Extend<T[P]> }

// eslint-disable-next-line @typescript-eslint/ban-types
export type _Extend<T> = T extends Function
  ? T | ServerEventDataState | ActionDataState
  : T extends Array<infer U>
    ? _DeepPartialArray<U>
    : T extends object
      ? Extend<T>
      : T | ReferencedDataState | StateDataState

export interface _DeepPartialArray<T> extends Array<_Extend<T>> {}

export function createComponentDefinition<
  T extends JSXElementConstructor<any> | keyof JSX.IntrinsicElements,
  P = React.ComponentProps<T>,
>(type: string) {
  return (props: Extend<P>): ReactElement => ({
    type,
    props,
    key: null,
  })
}

export function isReactElement(obj: any): obj is ReactElement {
  return obj !== null && typeof obj === 'object' && 'type' in obj && 'props' in obj && 'key' in obj
}
