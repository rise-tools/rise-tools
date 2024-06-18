import { action, ActionsDefinition } from '@rise-tools/react'

export type ExpoRouterActions = ActionsDefinition<
  [ReturnType<typeof navigate>, ReturnType<typeof goBack>]
>

export const navigate = (path: string) => action('@rise-tools/kit-expo-router/navigate', { path })
export const goBack = () => action('@rise-tools/kit-expo-router/goBack')
