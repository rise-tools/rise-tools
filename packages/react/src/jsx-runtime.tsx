import type { JSXElementConstructor, ReactElement } from 'react'
import React from 'react'

import { event } from './events'
import {
  HandlerFunction,
  isComponentModelState,
  ReferencedModelState,
  ServerHandlerModelState,
  ServerModelState,
} from './rise'

/**
 * When rendering server-side component definitions, `componentFactory` will return `ReactElement`:
 * ```tsx
 * const View = createComponentDefinition('View')
 *
 * <View />
 * ```
 * See `createComponentDefinition` function for more details.
 *
 * When rendering function defined on the server, `componentFactory` will return `ServerModelState`:
 * ```tsx
 * const View = createComponentDefinition('View')
 *
 * function Helper() {
 *   return isMobile ? <View /> : 'foo'
 * }
 *
 * <Helper />
 * ```
 */
type ComponentFactory = (props: any) => ServerModelState | ReactElement
type Props = Record<string, any>

export const jsxs = (componentFactory: ComponentFactory, props: Props, key: string) => {
  return jsxImpl(componentFactory, props, key, true)
}

export const jsx = (componentFactory: ComponentFactory, props: Props, key: string) => {
  return jsxImpl(componentFactory, props, key, false)
}

export const jsxImpl = (
  componentFactory: ComponentFactory,
  passedProps: Props,
  key: string,
  isStaticChildren: boolean
) => {
  if (isStaticChildren) {
    Object.defineProperty(passedProps.children, '$static', {
      value: true,
      enumerable: false,
    })
  }
  const el = componentFactory(passedProps)
  if (!isReactElement(el)) {
    if (!key) {
      return el
    }
    if (isComponentModelState(el)) {
      return {
        ...el,
        key,
      }
    }
    return {
      $: 'component',
      component: 'rise-tools/react/Fragment',
      key,
      children: el,
    }
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

export type WithServerProps<T> = { [P in keyof T]: _Extend<T[P]> }

interface _ExtendArray<T> extends Array<_Extend<T>> {}

export type _Extend<T> = T extends (...args: infer Args) => infer ReturnType
  ? HandlerFunction<Args, ReturnType> | ServerHandlerModelState<Args, ReturnType>
  : T extends Array<infer U>
    ? _ExtendArray<U>
    : T extends object
      ? WithServerProps<T>
      : T extends null | undefined
        ? T
        : T | ReferencedModelState

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
