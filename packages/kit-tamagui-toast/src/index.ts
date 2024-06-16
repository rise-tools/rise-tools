import type { ActionDefinition, ActionModelState } from '@rise-tools/react'
import { useToastController } from '@tamagui/toast'

type TamaguiToastActions = {
  toast: ActionDefinition<ToastAction>
}

export type ToastAction = ActionModelState<'toast', { title: string; message?: string }>

export const useToastActions = (): TamaguiToastActions => {
  const toast = useToastController()

  return {
    toast: {
      action: ({ title, message }) => {
        toast.show(title, { message })
      },
    },
  }
}
