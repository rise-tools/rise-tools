import { Stack, useRouter } from 'expo-router'
import z from 'zod'

import type { ExpoRouterActions } from './server'

const NavigateActionPayload = z.object({
  path: z.string(),
})

export const useExpoRouterActions = (opts?: { basePath?: string }): ExpoRouterActions => {
  const router = useRouter()

  return {
    '@rise-tools/kit-expo-router/navigate': {
      action: ({ path }) => {
        router.push([opts?.basePath || '', path].join('/'))
      },
      validate: (payload) => NavigateActionPayload.parse(payload),
    },
    '@rise-tools/kit-expo-router/goBack': {
      action: () => {
        router.back()
      },
    },
  }
}

export const ExpoRouterComponents = {
  StackScreen: {
    component: Stack.Screen,
  },
}
