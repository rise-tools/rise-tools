import { createWritableStream, ModelSource, useStream } from '@rise-tools/react'
import { WebSocketModelSource } from '@rise-tools/ws-client'
import { AlertCircle } from '@tamagui/lucide-icons'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { H4, SizableText, Text, YStack } from 'tamagui'

export function DataBoundary({
  modelSource,
  path,
  children,
}: PropsWithChildren<{ modelSource: WebSocketModelSource | ModelSource; path: string }>) {
  const data = useStream(modelSource.get(path))

  if ('ws' in modelSource) {
    return (
      <WebSocketDataBoundary modelSource={modelSource} path={path}>
        {children}
      </WebSocketDataBoundary>
    )
  }

  if (data !== undefined) {
    return <YStack flex={1}>{children}</YStack>
  }

  return null
}

const useStatus = (ws: WebSocketModelSource['ws']) => {
  const [isConnected, setConnected] = useState<boolean | undefined>(undefined)

  let timeout: NodeJS.Timeout | undefined
  const setConnectedDelayed = (connected: boolean) => {
    if (timeout) {
      return
    }
    timeout = setTimeout(() => {
      setConnected(connected)
      timeout = undefined
    }, 1000)
  }

  useEffect(() => {
    let hasConnectedAlready = false
    const onDisconnected = () => {
      if (hasConnectedAlready) {
        setConnectedDelayed(false)
      } else {
        setConnected(false)
      }
    }
    const onConnected = () => {
      hasConnectedAlready = true
      clearTimeout(timeout)
      setConnected(true)
    }
    ws.addEventListener('open', onConnected)
    ws.addEventListener('close', onDisconnected)
    ws.addEventListener('error', onDisconnected)
    return () => {
      ws.removeEventListener('open', onConnected)
      ws.removeEventListener('close', onDisconnected)
      ws.removeEventListener('error', onDisconnected)
    }
  }, [ws])

  return isConnected
}

function WebSocketDataBoundary({
  modelSource,
  path,
  children,
}: PropsWithChildren<{ modelSource: WebSocketModelSource; path: string }>) {
  const isConnected = useStatus(modelSource.ws)
  const data = useStream(modelSource.get(path))

  if (data !== undefined) {
    return (
      <YStack flex={1}>
        {!isConnected && (
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

  if (!isConnected) {
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
