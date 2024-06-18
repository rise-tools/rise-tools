import { action, ActionsDefinition, createComponentDefinition } from '@rise-tools/react'
import { Stack } from 'expo-router'

export type ExpoRouterActions = ActionsDefinition<
  [ReturnType<typeof navigate>, ReturnType<typeof goBack>]
>

export const navigate = (path: string) => action('@rise-tools/kit-expo-router/navigate', { path })
export const goBack = () => action('@rise-tools/kit-expo-router/goBack')

export const StackScreen = createComponentDefinition<typeof Stack.Screen>('StackScreen')
