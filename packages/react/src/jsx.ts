import { ComponentDataState, JSONValue } from './template'

export function jsx(
  componentFactory: (props: any) => React.ReactElement,
  { children, ...passedProps }: Record<string, JSONValue>,
  key: string
): ComponentDataState {
  const { props, type } = componentFactory(passedProps)
  if (typeof type !== 'string') {
    throw new Error('Invalid component.')
  }
  const serialisedProps = Object.fromEntries<typeof props>(
    Object.entries(props).map(([key, value]) => {
      // tbd: create a global handler registry and register this callback
      // make sure to clean-up when no longer needed
      if (typeof value === 'function') {
        const uuid = 'generate-uuid-for-handler'
        return [
          key,
          {
            $: 'event',
            action: uuid,
          },
        ]
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
