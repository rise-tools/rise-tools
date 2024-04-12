import React, { ComponentProps as PropsOf, PropsWithChildren } from 'react'

import { ComponentProps } from '.'

export function wrapEvents<T extends React.ComponentType<PropsWithChildren<any>>>(
  Component: T,
  propsToWrap: (keyof PropsOf<T>)[]
) {
  function Wrapper(props: PropsOf<T> & ComponentProps) {
    for (const propName of propsToWrap) {
      const propValue = props[propName]
      if (propValue === null) {
        continue
      }

      const action = propValue
        ? [...(Array.isArray(propValue) ? propValue : [propValue])]
        : undefined

      props[propName] = (...args: any[]) => {
        props.onTemplateEvent(propName, { action, args })
      }
    }

    // @ts-ignore fix this error
    return <Component {...props} />
  }
  return Wrapper
}
