import { DataSource, useStream } from '@rise-tools/react'
import { WebSocketDataSource } from '@rise-tools/ws-client'
import { AlertCircle } from '@tamagui/lucide-icons'
import React, { PropsWithChildren } from 'react'
import { H4, SizableText, Text, YStack } from 'tamagui'

export function DataBoundary({
  dataSource,
  path,
  children,
}: PropsWithChildren<{ dataSource: WebSocketDataSource | DataSource; path: string }>) {
  const data = useStream(dataSource.get(path))

  if ('state' in dataSource) {
    return (
      <WebSocketDataBoundary dataSource={dataSource} path={path}>
        {children}
      </WebSocketDataBoundary>
    )
  }

  if (data !== undefined) {
    return <YStack flex={1}>{children}</YStack>
  }

  return null
}

function WebSocketDataBoundary({
  dataSource,
  path,
  children,
}: PropsWithChildren<{ dataSource: WebSocketDataSource; path: string }>) {
  const state = useStream(dataSource.state)
  const data = useStream(dataSource.get(path))

  if (data !== undefined) {
    return (
      <YStack flex={1}>
        {state.status === 'disconnected' && (
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

  if (state.status === 'disconnected') {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$3" gap="$2">
        <AlertCircle size="$5" color="$red9" />
        <H4 color="$red9">You are disconnected</H4>
        <SizableText textAlign="center" lineHeight="$1">
          Please check your network connection. The app will reconnect automatically.
        </SizableText>
      </YStack>
    )
  }

  return null
}
