import type { ActionDefinition } from '@rise-tools/react'
import * as Haptics from 'expo-haptics'
import z from 'zod'

import type { ImpactAction, NotificationAction, SelectionAction } from './server'

const ImpactActionPayload = z.object({
  style: z.nativeEnum(Haptics.ImpactFeedbackStyle),
})

const NotificationActionPayload = z.object({
  type: z.nativeEnum(Haptics.NotificationFeedbackType),
})

type HapticsActions = {
  'haptics/impact': ActionDefinition<ImpactAction>
  'haptics/notification': ActionDefinition<NotificationAction>
  'haptics/selection': ActionDefinition<SelectionAction>
}

export const useHapticsActions = (): HapticsActions => {
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
