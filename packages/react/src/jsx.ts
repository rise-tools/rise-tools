import { ComponentDataState, JSONValue } from './template'

export function jsx(
  componentFactory: (props: any) => string,
  { children, ...props }: Record<string, JSONValue>,
  key: string
): ComponentDataState {
  return {
    $: 'component',
    component: componentFactory(props),
    key,
    props,
    children,
  }
}

// tbd: we could use componentFactory() to validation props on the server
// while making client faster
