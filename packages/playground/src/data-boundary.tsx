import { useStream } from '@final-ui/react'
import { WebSocketDataSource } from '@final-ui/ws-client'
import React, { PropsWithChildren } from 'react'
import { H4, SizableText, Text, YStack } from 'tamagui'

// tbd: convert `WebSocketDataSource` to `NetworkDataSource`
export function DataBoundary({
  dataSource,
  path,
  children,
}: PropsWithChildren<{ dataSource: WebSocketDataSource; path: string }>) {
  const { status } = useStream(dataSource.state)
  const data = useStream(dataSource.get(path))

  if (data !== undefined) {
    return (
      <YStack>
        {status === 'closed' && (
          <YStack padding="$3" backgroundColor="$red5">
            <Text textAlign="center" color="$red9">
              You are disconnected. Please check your network connection.
            </Text>
          </YStack>
        )}
        {children}
      </YStack>
    )
  }

  if (status === 'closed') {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$3" gap="$2">
        <H4>You are disconnected</H4>
        <SizableText textAlign="center" lineHeight="$1">
          Please check your network connection. The app will reconnect automatically.
        </SizableText>
      </YStack>
    )
  }

  return null
}
