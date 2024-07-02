import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { registerRootComponent } from 'expo'
import { useFonts } from 'expo-font'
import * as Linking from 'expo-linking'
import * as SystemUI from 'expo-system-ui'
import React, { useEffect } from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Screens } from './screens'
import { storage } from './storage'
import { tamaguiConfig } from './tamagui/config'
import { TamaguiProvider } from './tamagui/provider'

const prefix = Linking.createURL('/')

function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const scheme = useColorScheme()
  const theme = scheme === 'dark' ? DarkTheme : DefaultTheme
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.card)
    StatusBar.setBackgroundColor(theme.colors.card)
  }, [theme])

  if (!loaded) {
    return null
  }

  const initialState = storage.getString('react-navigation')

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TamaguiProvider config={tamaguiConfig}>
          <NavigationContainer
            linking={{
              prefixes: [prefix],
            }}
            theme={theme}
            initialState={initialState ? JSON.parse(initialState) : undefined}
            onStateChange={(state) => storage.set('react-navigation', JSON.stringify(state))}
          >
            <Screens />
          </NavigationContainer>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

registerRootComponent(App)
