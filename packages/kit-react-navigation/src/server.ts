import { action, ActionsDefinition, createComponentDefinition } from '@rise-tools/react'

import type { Screen } from './index'

export type ReactNavigationActions = ActionsDefinition<
  [ReturnType<typeof navigate>, ReturnType<typeof goBack>]
>

type PathType<T> = 'path' extends keyof T ? T['path'] : string

export interface Navigate {}

// eslint-disable-next-line @typescript-eslint/ban-types
type AnyString = string & {}

export const navigate = (path: PathType<Navigate> | AnyString) =>
  action('rise-tools/kit-react-navigation/navigate', { path })

export const goBack = () => action('rise-tools/kit-react-navigation/goBack')

export const StackScreen = createComponentDefinition<typeof Screen>(
  'rise-tools/kit-react-navigation/StackScreen'
)

navigate('')
