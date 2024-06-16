import { ToastProvider as ToastProviderOg } from '@tamagui/toast'
import React, { PropsWithChildren } from 'react'

import { Toast } from './Toast'
import { ToastViewport } from './ToastViewport'

export function ToastProvider({ children }: PropsWithChildren) {
  return (
    <ToastProviderOg swipeDirection="horizontal">
      {children}
      <Toast />
      <ToastViewport />
    </ToastProviderOg>
  )
}
