import { ToastProvider } from '@rise-tools/kit-tamagui-toast'
import React from 'react'
import { useColorScheme } from 'react-native'
import { TamaguiProvider, TamaguiProviderProps } from 'tamagui'

export function Provider({ children, ...rest }: TamaguiProviderProps) {
  const scheme = useColorScheme()
  return (
    <TamaguiProvider disableInjectCSS defaultTheme={scheme === 'dark' ? 'dark' : 'light'} {...rest}>
      <ToastProvider>{children}</ToastProvider>
    </TamaguiProvider>
  )
}
