import { XStack } from '@rise-tools/kitchen-sink/server'
import React, { PropsWithChildren } from 'react'

export function Content({ children }: PropsWithChildren) {
  return <XStack gap="$2">{children}</XStack>
}
