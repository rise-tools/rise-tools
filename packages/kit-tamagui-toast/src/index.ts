import type { ActionsDefinition } from '@rise-tools/react'
import { useToastController } from '@tamagui/toast'
import z from 'zod'

import type { ToastAction } from './server'

const ToastActionPayload = z.object({
  title: z.string(),
  message: z.string().optional(),
  duration: z.number().optional(),
})

export const useToastActions = (): ActionsDefinition<ToastAction> => {
  const toast = useToastController()

  return {
    toast: {
      action: ({ title, ...options }) => {
        toast.show(title, options)
      },
      validate: (payload) => ToastActionPayload.parse(payload),
    },
  }
}

export * from './provider'
