import { Toast as ToastOg, useToastState } from '@tamagui/toast'
import React from 'react'
import { YStack } from 'tamagui'

export function Toast() {
  const toast = useToastState()

  if (!toast || toast.isHandledNatively) {
    return null
  }

  return (
    <ToastOg
      key={toast.id}
      duration={toast.duration}
      viewportName={toast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="quick"
    >
      <YStack paddingVertical="$1.5" paddingHorizontal="$2">
        <ToastOg.Title lineHeight="$1">{toast.title}</ToastOg.Title>
        {!!toast.message && <ToastOg.Description>{toast.message}</ToastOg.Description>}
      </YStack>
    </ToastOg>
  )
}
