import { JSXElementConstructor, ReactElement } from 'react'

import { handler } from './events'
import { ComponentDataState, JSONValue } from './template'

type Props = Record<string, JSONValue | ((args: any) => any)> & {
  children: JSONValue
}

// tbd: investigate this
export const jsxs = jsx

export function jsx(
  componentFactory: (props: any) => React.ReactElement<Props>,
  { children, ...passedProps }: Props,
  key: string
): ComponentDataState {
  const { type, props } = componentFactory(passedProps)
  if (typeof type !== 'string') {
    throw new Error('Invalid component. Make sure to use server-side version of your components.')
  }
  const serialisedProps = Object.fromEntries(
    Object.entries(props).map(([key, value]) => {
      if (typeof value === 'function') {
        return [key, handler(value)]
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

export function createComponentDefinition<
  T extends JSXElementConstructor<any> | keyof JSX.IntrinsicElements,
  P = React.ComponentProps<T>,
>(type: string) {
  return (props: P): ReactElement => ({
    type,
    props,
    key: null,
  })
}
