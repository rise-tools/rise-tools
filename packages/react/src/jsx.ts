import { ComponentDataState, JSONValue } from './template'

export function jsx(
  componentFactory: (props: any) => string,
  { key, ...props }: { key: string } & Record<string, JSONValue>,
  children: JSONValue
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
