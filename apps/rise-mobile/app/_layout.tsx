import { Provider, tamaguiConfig } from '@react-native-templates/app'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, usePathname, useRouter } from 'expo-router'
import React from 'react'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ExpoStorageProvider, navigationStore } from '../src/expo-storage'

export const unstable_settings = {
  // https://docs.expo.dev/router/advanced/router-settings/
  initialRouteName: 'index',
}

export default function HomeLayout() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const route = navigationStore.getRoute()
    if (route && route !== '/') {
      setTimeout(() => {
        router.push(route)
      }, 500)
    }
  }, [])
  useEffect(() => {
    navigationStore.setRoute(pathname)
  }, [pathname])
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })
  const scheme = useColorScheme()
  if (!loaded) {
    return null
  }
  return (
    <Provider config={tamaguiConfig}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <ExpoStorageProvider>
            <Stack>
              <Stack.Screen
                name="connection/[id]"
                // @ts-ignore
                getId={({ params }: { params: { id: string; path: string } }) => {
                  return `${params.id}-${params.path}`
                }}
              />
            </Stack>
          </ExpoStorageProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  )
}
