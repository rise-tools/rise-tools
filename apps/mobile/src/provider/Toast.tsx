import { Toast as ToastOg, useToastState } from '@tamagui/toast'
import React from 'react'
import { YStack } from 'tamagui'

export function Toast() {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) {
    return null
  }

  return (
    <ToastOg
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="quick"
    >
      <YStack paddingVertical="$1.5" paddingHorizontal="$2">
        <ToastOg.Title lineHeight="$1">{currentToast.title}</ToastOg.Title>
        {!!currentToast.message && (
          <ToastOg.Description>{currentToast.message}</ToastOg.Description>
        )}
      </YStack>
    </ToastOg>
  )
}
