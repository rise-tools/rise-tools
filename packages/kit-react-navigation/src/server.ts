import type { createNativeStackNavigator } from '@react-navigation/native-stack'
import { action, ActionsDefinition, createComponentDefinition } from '@rise-tools/react'

export type ReactNavigationActions = ActionsDefinition<
  [ReturnType<typeof navigate>, ReturnType<typeof goBack>]
>

export const navigate = (path: string) =>
  action('rise-tools/kit-react-navigation/navigate', { path })

export const goBack = () => action('rise-tools/kit-react-navigation/goBack')

type NativeStack = ReturnType<typeof createNativeStackNavigator>
export const Stack = {
  Screen: createComponentDefinition<NativeStack['Screen']>(
    'rise-tools/kit-react-navigation/NativeStackScreen'
  ),
  Navigator: createComponentDefinition<NativeStack['Navigator']>(
    'rise-tools/kit-react-navigation/NativeStackNavigator'
  ),
}
