import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { useServerInsertedHTML } from 'next/navigation'
import React from 'react'
import { StyleSheet } from 'react-native'
import { PortalProvider, TamaguiProvider } from 'tamagui'
import { config } from '@react-native-templates/demo-ui'

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useRootTheme()

  useServerInsertedHTML(() => {
    // @ts-ignore
    // tbd: debug this
    const rnwStyle = StyleSheet.getSheet()
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }} id={rnwStyle.id} />
        <style
          dangerouslySetInnerHTML={{
            __html: config.getCSS({
              // if you are using "outputCSS" option, you should use this "exclude"
              // if not, then you can leave the option out
              exclude: process.env.NODE_ENV === 'production' ? 'design-system' : null,
            }),
          }}
        />
      </>
    )
  })

  return (
    <NextThemeProvider
      skipNextHead
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <TamaguiProvider config={config} defaultTheme={theme}>
        <PortalProvider shouldAddRootHost>
          {children}
        </PortalProvider>
      </TamaguiProvider>
    </NextThemeProvider>
  )
}
