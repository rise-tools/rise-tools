import { HomeScreen } from 'app/screens/home'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Rise Remote',
        }}
      />
      <HomeScreen />
    </>
  )
}
