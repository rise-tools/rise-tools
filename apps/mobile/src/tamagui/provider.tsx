import { ToastProvider } from '@rise-tools/kit-tamagui-toast'
import React from 'react'
import { useColorScheme } from 'react-native'
import { PortalProvider, TamaguiProvider as TamaguiProviderOg, TamaguiProviderProps } from 'tamagui'

export function TamaguiProvider({ children, ...rest }: TamaguiProviderProps) {
  const scheme = useColorScheme()
  return (
    <TamaguiProviderOg
      disableInjectCSS
      defaultTheme={scheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >
      <PortalProvider>
        <ToastProvider>{children}</ToastProvider>
      </PortalProvider>
    </TamaguiProviderOg>
  )
}
