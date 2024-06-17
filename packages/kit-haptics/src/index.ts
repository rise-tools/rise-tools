import type { ActionsDefinition } from '@rise-tools/react'
import * as Haptics from 'expo-haptics'
import z from 'zod'

import type { ImpactAction, NotificationAction, SelectionAction } from './server'

const ImpactActionPayload = z.object({
  style: z.nativeEnum(Haptics.ImpactFeedbackStyle).or(z.undefined()),
})

const NotificationActionPayload = z.object({
  type: z.nativeEnum(Haptics.NotificationFeedbackType).or(z.undefined()),
})

type HapticsActions = ActionsDefinition<ImpactAction | NotificationAction | SelectionAction>

export const useHapticsActions = (): HapticsActions => {
  // @ts-ignore https://github.com/colinhacks/zod/issues/635
  return {
    'haptics/impact': {
      action: ({ style }) => {
        Haptics.impactAsync(style)
      },
      validate: (payload) => ImpactActionPayload.parse(payload),
    },
    'haptics/notification': {
      action: ({ type }) => {
        Haptics.notificationAsync(type)
      },
      validate: (payload) => NotificationActionPayload.parse(payload),
    },
    'haptics/selection': {
      action: () => {
        Haptics.selectionAsync()
      },
    },
  }
}
