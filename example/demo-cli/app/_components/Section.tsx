import { Theme, YStack } from '@rise-tools/kitchen-sink/server'
import React from 'react'

/* Utils */
export function Section({ children }: { children: React.ReactNode }) {
  return (
    <Theme name="green_active">
      <YStack
        gap="$2"
        borderColor="$borderColor"
        borderRadius="$8"
        borderWidth="$2"
        padding="$4"
        marginHorizontal="$4"
      >
        {children}
      </YStack>
    </Theme>
  )
}
