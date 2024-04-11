import { ToastProvider } from '@tamagui/toast'
import React from 'react'
import { useColorScheme } from 'react-native'
import { TamaguiProvider, TamaguiProviderProps } from 'tamagui'

import { tamaguiConfig } from '..'
import { Toast } from './Toast'
import { ToastViewport } from './ToastViewport'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme()

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      disableInjectCSS
      defaultTheme={scheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >
      <ToastProvider
        swipeDirection="horizontal"
        duration={6000}
        native={
          [
            /* uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go */
            // 'mobile'
          ]
        }
      >
        {children}
        <Toast />
        <ToastViewport />
      </ToastProvider>
    </TamaguiProvider>
  )
}
