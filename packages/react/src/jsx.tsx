import type { JSXElementConstructor, ReactElement } from 'react'

import { event, ServerEventDataState } from './events'
import {
  ActionDataState,
  ComponentDataState,
  DataState,
  isActionDataState,
  JSONValue,
  ReferencedDataState,
} from './template'

type AllowedDataStates =
  | ServerEventDataState
  | ActionDataState
  | ReferencedDataState
  | ((args: any) => any)

type Props = Record<string, JSONValue | AllowedDataStates> & {
  children: DataState
}

export const jsxs = jsx

export function jsx(
  componentFactory: (props: any) => ReactElement<Props>,
  { children, ...passedProps }: Props,
  key?: string
): ComponentDataState {
  const { type, props } = componentFactory(passedProps)
  if (typeof type !== 'string') {
    throw new Error('Invalid component. Make sure to use server-side version of your components.')
  }
  const serialisedProps = Object.fromEntries(
    Object.entries(props).map(([key, value]) => {
      if (typeof value === 'function') {
        return [key, event(value)]
      }
      if (isActionDataState(value)) {
        return [key, event(value)]
      }
      return [key, value]
    })
  )
  return {
    $: 'component',
    component: type,
    key,
    props: serialisedProps,
    children,
  }
}

type Extend<P, K> = {
  [Key in keyof P]: P[Key] extends infer T ? (T extends object ? K | Extend<T, K> : T | K) : never
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
  return obj !== null && 'type' in obj && 'props' in obj && 'key' in obj
}

export type UI = ReactElement | ComponentDataState
