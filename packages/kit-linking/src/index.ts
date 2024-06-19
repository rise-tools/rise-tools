import * as Linking from 'expo-linking'
import z from 'zod'

import type { LinkingActions } from './server'

const OpenURLPayload = z.object({
  url: z.string(),
})

export const useLinkingActions = (): LinkingActions => {
  return {
    '@rise-tools/kit-linking/openURL': {
      action: ({ url }) => {
        Linking.openURL(url)
      },
      validate: (payload) => OpenURLPayload.parse(payload),
    },
    '@rise-tools/kit-linking/openSettings': {
      action: () => {
        Linking.openSettings()
      },
    },
  }
}
