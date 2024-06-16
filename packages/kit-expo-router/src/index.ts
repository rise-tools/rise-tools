import type { ActionDefinition, ActionModelState } from '@rise-tools/react'
import { useRouter } from 'expo-router'

type ExpoRouterActions = {
  navigate: ActionDefinition<NavigateAction>
  goBack: ActionDefinition<GoBackAction>
}

export type NavigateAction = ActionModelState<'navigate', { path: string }>
export type GoBackAction = ActionModelState<'goBack'>

export const useExpoRouterActions = (opts?: { prefix?: string }): ExpoRouterActions => {
  const router = useRouter()

  return {
    navigate: {
      action: ({ path }) => {
        router.push([opts?.prefix || '', path].join('/'))
      },
    },
    goBack: {
      action: () => {
        router.back()
      },
    },
  }
}
