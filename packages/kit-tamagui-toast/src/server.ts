import { action, ActionModelState, ActionsDefinition } from '@rise-tools/react'

export type ToastActions = ActionsDefinition<{
  '@rise-tools/kit-tamagui-toast/toast': ToastAction
}>

type ToastAction = ActionModelState<
  '@rise-tools/kit-tamagui-toast/toast',
  {
    title: string
    message?: string
    duration?: number
  }
>

export const toast = (title: string, message?: string, duration?: number): ToastAction =>
  action('@rise-tools/kit-tamagui-toast/toast', { title, message, duration })
