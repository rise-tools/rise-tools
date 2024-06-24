import { action, ActionsDefinition } from '@rise-tools/react'

export type ReactNavigationActions = ActionsDefinition<
  [ReturnType<typeof navigate>, ReturnType<typeof goBack>]
>

export const navigate = (path: string) =>
  action('rise-tools/kit-react-navigation/navigate', { path })
export const goBack = () => action('rise-tools/kit-react-navigation/goBack')
