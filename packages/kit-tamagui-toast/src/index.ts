import { useToastController } from '@tamagui/toast'
import z from 'zod'

import { ToastActions } from './server'

const ToastActionPayload = z.object({
  title: z.string(),
  message: z.string().optional(),
  duration: z.number().optional(),
})

export const useToastActions = (): ToastActions => {
  const toast = useToastController()

  return {
    '@rise-tools/kit-tamagui-toast/toast': {
      action: ({ title, ...options }) => {
        toast.show(title, options)
      },
      validate: (payload) => ToastActionPayload.parse(payload),
    },
  }
}

export * from './provider'
