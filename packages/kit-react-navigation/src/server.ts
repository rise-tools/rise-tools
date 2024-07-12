import { action, ActionsDefinition, createComponentDefinition } from '@rise-tools/react'

import type { Screen } from './index'

export type ReactNavigationActions = ActionsDefinition<
  [ReturnType<typeof navigate>, ReturnType<typeof goBack>]
>

export interface NavigatePath {}

export const navigate = (path: keyof NavigatePath | (string & { $: string })) =>
  action('rise-tools/kit-react-navigation/navigate', { path })

export const goBack = () => action('rise-tools/kit-react-navigation/goBack')

export const StackScreen = createComponentDefinition<typeof Screen>(
  'rise-tools/kit-react-navigation/StackScreen'
)
