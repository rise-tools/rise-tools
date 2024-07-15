import { navigate, Stack } from '@rise-tools/kit-react-navigation/server'
import { Button, H1, View } from '@rise-tools/kitchen-sink/server'

export const models = {
  navigation: Navigation,
  'navigation:index': Home,
  'navigation:settings': Settings,
}

function Navigation() {
  const screens = [
    { name: 'navigation:index', options: { title: 'Home' } },
    { name: 'navigation:settings', options: { title: 'Settings' } },
  ]
  return (
    <Stack.Navigator initialRouteName={'navigation:index'} screens={screens}>
      {/* <Stack.Screen name="navigation:index" options={{ title: 'Home' }} />
      <Stack.Screen name="navigation:settings" options={{ title: 'Settings' }} /> */}
    </Stack.Navigator>
  )
}

function Home() {
  return (
    <View>
      <H1>Home</H1>
      <Button onPress={navigate('navigation:settings')}>Go to settings</Button>
    </View>
  )
}

function Settings() {
  return (
    <View>
      <H1>Settings</H1>
    </View>
  )
}
