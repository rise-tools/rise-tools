import React from 'react'

import { ComponentProps } from '.'

export function wrapEvents(Component: React.ComponentType<ComponentProps>, propsToWrap: string[]) {
  function Wrapper(passedProps: Record<string, any> & ComponentProps) {
    for (const propName of propsToWrap) {
      if (passedProps[propName]) {
        console.warn(
          `Cannot pass "${propName}" to "${Component.displayName}". Use "onTemplateEvent" instead`
        )
      }
      passedProps[propName] = (payload: any) => {
        passedProps.onTemplateEvent(propName, payload)
      }
    }
    return <Component {...passedProps} />
  }
  return Wrapper
}
