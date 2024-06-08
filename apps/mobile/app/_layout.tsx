import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import React from 'react'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { Provider } from '../src/provider'
import { tamaguiConfig } from '../src/tamagui/config'

export default function HomeLayout() {
  // const pathname = usePathname()
  // const router = useRouter()

  // useEffect(() => {
  //   const route = navigationStore.getRoute()
  //   if (route && route !== '/') {
  //     setTimeout(() => {
  //       router.push(route)
  //     }, 500)
  //   }
  // }, [])

  // useEffect(() => {
  //   navigationStore.setRoute(pathname)
  // }, [pathname])

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
