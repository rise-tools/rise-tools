import { DataSourceStateStream, useStream } from '@final-ui/react'
import React, { PropsWithChildren } from 'react'
import { Text, YStack } from 'tamagui'

export function DataBoundary({
  state,
  children,
}: PropsWithChildren<{ state: DataSourceStateStream }>) {
  const { status } = useStream(state)
  return (
    <YStack>
      <Text>{status}</Text>
      {children}
    </YStack>
  )
}
