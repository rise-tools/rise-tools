import { action, ActionsDefinition } from '@rise-tools/react'

export type ExpoRouterActions = ActionsDefinition<{
  '@rise-tools/kit-expo-router/navigate': ReturnType<typeof navigate>
  '@rise-tools/kit-expo-router/goBack': ReturnType<typeof goBack>
}>

export const navigate = (path: string) => action('@rise-tools/kit-expo-router/navigate', { path })
export const goBack = () => action('@rise-tools/kit-expo-router/goBack')
