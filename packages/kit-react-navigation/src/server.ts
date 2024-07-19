import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { action, ActionsDefinition, createComponentDefinition } from '@rise-tools/react'

import type { Screen } from './index'

export type ReactNavigationActions = ActionsDefinition<
  [ReturnType<typeof navigate>, ReturnType<typeof goBack>]
>

export const navigate = <T extends keyof Path<Navigate>>(
  path: T,
  options?: NativeStackNavigationOptions
) => action('rise-tools/kit-react-navigation/navigate', { path, options })

export const goBack = () => action('rise-tools/kit-react-navigation/goBack')

export const StackScreen = createComponentDefinition<typeof Screen>(
  'rise-tools/kit-react-navigation/StackScreen'
)

type Path<T> = 'screens' extends keyof T ? T['screens'] : Record<string, any>

export interface Navigate {}
