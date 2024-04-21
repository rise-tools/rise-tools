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
  return {
    $: 'component',
    component: type,
    key,
    props,
    children,
  }
}

// tbd: we could use componentFactory() to validation props on the server
// while making client faster
