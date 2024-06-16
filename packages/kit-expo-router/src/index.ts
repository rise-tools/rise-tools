import type { ActionDefinition, ActionModelState } from '@rise-tools/react'
import { useRouter } from 'expo-router'

type Actions = {
  navigate: ActionDefinition<NavigateAction>
  goBack: ActionDefinition<GoBackAction>
}

export type NavigateAction = ActionModelState<'navigate', { path: string }>
export type GoBackAction = ActionModelState<'goBack', never>

export const useExpoRouterActions = (): Actions => {
  const router = useRouter()

  return {
    navigate: {
      action: ({ path }) => {
        router.push(path)
      },
    },
    goBack: {
      action: () => {
        router.back()
      },
    },
  }
}
