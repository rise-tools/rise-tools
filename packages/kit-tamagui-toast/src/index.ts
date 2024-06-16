import type { ActionDefinition } from '@rise-tools/react'
import { useToastController } from '@tamagui/toast'

import type { toast } from './server'

type TamaguiToastActions = {
  toast: ActionDefinition<ReturnType<typeof toast>>
}

export const useToastActions = (): TamaguiToastActions => {
  const toast = useToastController()

  return {
    toast: {
      action: ({ title, ...options }) => {
        toast.show(title, options)
      },
    },
  }
}

export * from './provider'
