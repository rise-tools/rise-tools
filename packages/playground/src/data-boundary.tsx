import { DataSource, useStream } from '@final-ui/react'
import React, { PropsWithChildren } from 'react'
import { Text, YStack } from 'tamagui'

export function DataBoundary({ info, children }: PropsWithChildren<{ info: DataSource['info'] }>) {
  const { status } = useStream(info)
  return (
    <YStack>
      <Text>{status}</Text>
      {children}
    </YStack>
  )
}
