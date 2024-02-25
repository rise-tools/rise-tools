import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Provider } from 'app/provider'
import { useFonts } from 'expo-font'
import { Stack, usePathname, useRouter } from 'expo-router'
import { useColorScheme } from 'react-native'

import { ExpoStorageProvider, navigationStore } from '../src/expo-storage'
import { useEffect } from 'react'

export default function HomeLayout() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const route = navigationStore.getRoute()
    if (route) {
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
    <Provider>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ExpoStorageProvider>
          <Stack>
            <Stack.Screen
              name="connection/[id]"
              getId={({ params }: { params: { id: string; path: string } }) => {
                return `${params.id}-${params.path}`
              }}
            />
          </Stack>
        </ExpoStorageProvider>
      </ThemeProvider>
    </Provider>
  )
}
