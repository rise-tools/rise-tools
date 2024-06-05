import type { JSXElementConstructor, ReactElement } from 'react'

import { event } from './events'
import {
  ComponentDataState,
  isComponentDataState,
  ReferencedDataState,
  ServerEventDataState,
  ServerHandlerDataState,
  StateDataState,
} from './template'

export type UI = ReactElement<Props> | ServerComponent

type ServerComponent = ComponentDataState<ServerEventDataState>
type Props = ServerComponent['props'] & {
  children?: ServerComponent['children']
}

export const jsxs = jsx

export function jsx(
  componentFactory: (props: any) => UI,
  { children, ...passedProps }: Props,
  key?: string
): ServerComponent {
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

export type Only<T> = {
  __only: T
}
export type WithServerProps<T> = { [P in keyof T]: _Extend<T[P]> }

export type _Extend<T> = T extends StateDataState
  ? T
  : T extends Only<infer U>
    ? U
    : T extends (...args: any) => any
      ? T | ServerHandlerDataState
      : T extends Array<infer U>
        ? _DeepPartialArray<U>
        : T extends object
          ? WithServerProps<T>
          : T extends null | undefined
            ? T
            : T | ReferencedDataState | StateDataState

export interface _DeepPartialArray<T> extends Array<_Extend<T>> {}

export function createComponentDefinition<
  T extends JSXElementConstructor<any> | keyof JSX.IntrinsicElements,
  P = React.ComponentProps<T>,
>(type: string) {
  return (props: WithServerProps<P>): ReactElement => ({
    type,
    props,
    key: null,
  })
}
