import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import React from 'react'
import { PortalProvider, TamaguiProvider } from 'tamagui'
import config from 'tamagui.config'

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useRootTheme()

  return (
    <NextThemeProvider
      skipNextHead
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <TamaguiProvider config={config} defaultTheme={theme}>
        <PortalProvider shouldAddRootHost>{children}</PortalProvider>
      </TamaguiProvider>
    </NextThemeProvider>
  )
}
