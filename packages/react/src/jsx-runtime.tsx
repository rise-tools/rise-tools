import type { JSXElementConstructor, ReactElement, ReactNode } from 'react'
import React from 'react'

import { event } from './events'
import {
  ComponentModelState,
  HandlerFunction,
  ReferencedModelState,
  ServerEventModelState,
  ServerHandlerModelState,
  StateModelState,
} from './rise'

type ServerComponent = ComponentModelState<ServerEventModelState>

type JSXFactory = (
  componentFactory: ((props: any) => ServerComponent | ReactNode) | undefined,
  { children, ...passedProps }: Record<string, any>,
  key?: string
) => ServerComponent | Exclude<ReactNode, ReactElement>

export const jsxs: JSXFactory = (componentFactory, passedProps, key) => {
  Object.defineProperty(passedProps.children, '$static', {
    value: true,
    enumerable: false,
  })
  return jsx(componentFactory, passedProps, key)
}

export const jsx: JSXFactory = (componentFactory, passedProps, key) => {
  if (typeof componentFactory === 'undefined') {
    return {
      $: 'component',
      component: 'rise-tools/react/Fragment',
      children: passedProps.children,
    }
  }
  const el = componentFactory(passedProps)
  if (!isReactElement(el)) {
    return el
  }
  if (typeof el.type !== 'string') {
    throw new Error('Invalid component. Make sure to use server-side version of your components.')
  }
  const { children, ...props } = Object.fromEntries(
    Object.entries(passedProps).map(([key, value]) => {
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
    props,
    children,
    ...(children?.$static ? { $staticChildren: true } : {}),
  }
}

export type Literal<T> = {
  __literal: T
}
export type LiteralArray<T> = Array<T> & {
  __literalArray: T[]
}

export type WithServerProps<T> = { [P in keyof T]: _Extend<T[P]> }

interface _ExtendArray<T> extends Array<_Extend<T>> {}

export type _Extend<T> = T extends StateModelState
  ? T
  : T extends Literal<infer U>
    ? U
    : T extends (...args: infer Args) => infer ReturnType
      ? HandlerFunction<Args, ReturnType> | ServerHandlerModelState<Args, ReturnType>
      : T extends Array<infer U>
        ? _ExtendArray<U> | (T extends LiteralArray<U> ? never : StateModelState<Array<U>>)
        : T extends object
          ? WithServerProps<T>
          : T extends null | undefined
            ? T
            : T | ReferencedModelState | StateModelState<T>

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

export function isReactElement(obj: any): obj is ReactElement {
  return obj !== null && typeof obj === 'object' && 'type' in obj && 'props' in obj && 'key' in obj
}

export const Fragment = createComponentDefinition<typeof React.Fragment>(
  'rise-tools/react/Fragment'
)
