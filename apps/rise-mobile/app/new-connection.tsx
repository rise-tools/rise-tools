import { NewConnectionScreen } from 'app/screens/new-connection'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'New Connection',
        }}
      />
      <NewConnectionScreen />
    </>
  )
}
