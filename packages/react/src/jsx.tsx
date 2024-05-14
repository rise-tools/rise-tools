import React from 'react'

import { event, ServerEventDataState } from './events'
import {
  ActionDataState,
  ComponentDataState,
  DataState,
  isActionDataState,
  isComponentDataState,
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

export type Element = ComponentDataState
export type ElementType<P> = (props: Extend<P, AllowedDataStates>) => Element

export const jsxs = jsx

export function jsx(
  componentFactory: ReturnType<typeof createComponentDefinition>,
  { children, ...passedProps }: Props,
  key?: string
): ComponentDataState {
  const component = componentFactory(passedProps)
  if (!isComponentDataState(component)) {
    throw new Error('Invalid component. Make sure to use server-side version of your components.')
  }
  const props = Object.fromEntries(
    Object.entries(passedProps).map(([key, value]) => {
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
    ...component,
    key,
    props,
    children,
  }
}

type Extend<P, K> = {
  [Key in keyof P]: P[Key] extends infer T ? (T extends object ? K | Extend<T, K> : T | K) : never
}

export function createComponentDefinition<
  T extends React.JSXElementConstructor<any> | keyof React.JSX.IntrinsicElements,
  P = React.ComponentProps<T>,
>(type: string): ElementType<P> {
  return () => ({
    $: 'component' as const,
    component: type,
  })
}
