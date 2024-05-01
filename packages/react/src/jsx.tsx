import { ComponentProps, ReactElement } from 'react'

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
    throw new Error('Invalid component.')
  }
  const serialisedProps = Object.fromEntries(
    Object.entries(props).map(([key, value]) => {
      if (typeof value === 'function') {
        // tbd: how do we now if it's async or not?
        // maybe some symbol on the function?
        // or, force users to pass "onSubmit={asyncHandler(() => {}}" instead of pure function.
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

export function createComponentDefinition<T extends React.ComponentType, K = ComponentProps<T>>(
  type: string,
  validator?: (props: K) => K
) {
  return (props: K): ReactElement => ({
    type,
    props: validator ? validator(props) : props,
    key: null,
  })
}
