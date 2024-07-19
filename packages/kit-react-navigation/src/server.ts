import { action, ActionsDefinition, createComponentDefinition } from '@rise-tools/react'

import type { Screen } from './index'

export type ReactNavigationActions = ActionsDefinition<
  [ReturnType<typeof navigate>, ReturnType<typeof goBack>]
>

type NavigateOptions = {
  screen?: {
    title?: string
  }
}

export const navigate = <T extends keyof Path<Navigate>, Params extends Path<Navigate>[T]>(
  path: T,
  ...[options]: Params extends void
    ? // If Params is void (no parameters required):
      [opts?: NavigateOptions]
    : Params extends NonNullable<unknown>
      ? // If Params is any non-nullable type (includes objects and primitives):
        [opts: NavigateOptions & { params: Params }]
      : // For any other case (type is any):
        [opts?: NavigateOptions & { params?: Params }]
) => action('rise-tools/kit-react-navigation/navigate', { path, options })

export const goBack = () => action('rise-tools/kit-react-navigation/goBack')

export const StackScreen = createComponentDefinition<typeof Screen>(
  'rise-tools/kit-react-navigation/StackScreen'
)

type Path<T> = 'screens' extends keyof T ? T['screens'] : Record<string, any>

export interface Navigate {}
