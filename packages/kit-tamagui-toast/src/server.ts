import { action, ActionModelState } from '@rise-tools/react'

export type ToastAction = ActionModelState<
  'toast',
  {
    title: string
    message?: string
    duration?: number
  }
>

export const toast = (title: string, message?: string, duration?: number): ToastAction =>
  action('toast', { title, message, duration })
