import * as Haptics from 'expo-haptics'
import z from 'zod'

import type { HapticsActions } from './server'

const ImpactActionPayload = z.object({
  style: z.nativeEnum(Haptics.ImpactFeedbackStyle).optional(),
})

const NotificationActionPayload = z.object({
  type: z.nativeEnum(Haptics.NotificationFeedbackType).optional(),
})

export const useHapticsActions = (): HapticsActions => {
  return {
    '@rise-tools/kit-haptics/impact': {
      action: ({ style }) => {
        Haptics.impactAsync(style)
      },
      validate: (payload) => ImpactActionPayload.parse(payload),
    },
    '@rise-tools/kit-haptics/notification': {
      action: ({ type }) => {
        Haptics.notificationAsync(type)
      },
      validate: (payload) => NotificationActionPayload.parse(payload),
    },
    '@rise-tools/kit-haptics/selection': {
      action: () => {
        Haptics.selectionAsync()
      },
    },
  }
}
