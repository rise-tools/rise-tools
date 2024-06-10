import { ToastProvider } from '@tamagui/toast'
import React from 'react'
import { useColorScheme } from 'react-native'
import { TamaguiProvider, TamaguiProviderProps } from 'tamagui'

import { Toast } from './Toast'
import { ToastViewport } from './ToastViewport'

export function Provider({ children, ...rest }: TamaguiProviderProps) {
  const scheme = useColorScheme()
  return (
    <TamaguiProvider disableInjectCSS defaultTheme={scheme === 'dark' ? 'dark' : 'light'} {...rest}>
      <ToastProvider swipeDirection="horizontal" duration={6000}>
        {children}
        <Toast />
        <ToastViewport />
      </ToastProvider>
    </TamaguiProvider>
  )
}
