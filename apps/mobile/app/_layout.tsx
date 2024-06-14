import { CommonActions, DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, useNavigationContainerRef } from 'expo-router'
import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { Provider } from '../src/provider'
import { storage } from '../src/storage'
import { tamaguiConfig } from '../src/tamagui/config'

export const unstable_settings = {
  // https://docs.expo.dev/router/advanced/router-settings/
  initialRouteName: 'index',
}

export default function HomeLayout() {
  const navigation = useNavigationContainerRef()

  useEffect(() => {
    if (__DEV__) {
      const state = storage.getString('navRoute-state')
      if (state) {
        const [, ...routes] = JSON.parse(state)
        setTimeout(() => {
          for (const route of routes) {
            navigation.dispatch(CommonActions.navigate(route))
          }
        }, 500)
      }
      return navigation.addListener('state', (e) => {
        storage.set('navRoute-state', JSON.stringify(e.data.state?.routes || []))
      })
    }
  }, [])

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const scheme = useColorScheme()
  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider config={tamaguiConfig}>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}
