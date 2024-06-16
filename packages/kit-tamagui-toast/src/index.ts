import type { ActionDefinition } from '@rise-tools/react'
import { useToastController } from '@tamagui/toast'

import type { toast } from './actions'

type TamaguiToastActions = {
  toast: ActionDefinition<ReturnType<typeof toast>>
}

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
