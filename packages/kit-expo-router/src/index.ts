import type { ActionDefinition } from '@rise-tools/react'
import { useRouter } from 'expo-router'

import type { goBack, navigate } from './server'

type ExpoRouterActions = {
  navigate: ActionDefinition<ReturnType<typeof navigate>>
  goBack: ActionDefinition<ReturnType<typeof goBack>>
}

export const useExpoRouterActions = (opts?: { basePath?: string }): ExpoRouterActions => {
  const router = useRouter()

  return {
    navigate: {
      action: ({ path }) => {
        router.push([opts?.basePath || '', path].join('/'))
      },
    },
    goBack: {
      action: () => {
        router.back()
      },
    },
  }
}
