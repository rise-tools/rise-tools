import type { ActionsDefinition } from '@rise-tools/react'
import { useRouter } from 'expo-router'
import z from 'zod'

import type { goBack, navigate } from './server'

const NavigateActionPayload = z.object({
  path: z.string(),
})

type ExpoRouterActions = ActionsDefinition<ReturnType<typeof navigate> | ReturnType<typeof goBack>>

export const useExpoRouterActions = (opts?: { basePath?: string }): ExpoRouterActions => {
  const router = useRouter()

  return {
    navigate: {
      action: ({ path }) => {
        router.push([opts?.basePath || '', path].join('/'))
      },
      validate: (payload) => NavigateActionPayload.parse(payload),
    },
    goBack: {
      action: () => {
        router.back()
      },
    },
  }
}
