import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from '@react-navigation/native'
import { registerRootComponent } from 'expo'
import { useFonts } from 'expo-font'
import * as React from 'react'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Screens } from './screens'
import { storage } from './storage'
import { tamaguiConfig } from './tamagui/config'
import { TamaguiProvider } from './tamagui/provider'

function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const scheme = useColorScheme()
  if (!loaded) {
    return null
  }

  const initialState = storage.getString('react-navigation')

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TamaguiProvider config={tamaguiConfig}>
          <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <NavigationContainer
              initialState={initialState ? JSON.parse(initialState) : undefined}
              onStateChange={(state) => storage.set('react-navigation', JSON.stringify(state))}
            >
              <Screens />
            </NavigationContainer>
          </ThemeProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

registerRootComponent(App)
