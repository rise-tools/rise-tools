import { XStack } from '@rise-tools/kitchen-sink/server'
import React from 'react'

export function Content({ children }: { children: React.ReactNode }) {
  return <XStack gap="$2">{children}</XStack>
}
