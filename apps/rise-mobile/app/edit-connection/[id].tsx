import { EditConnectionScreen } from 'app/screens/edit-connection'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Connection',
        }}
      />
      <EditConnectionScreen />
    </>
  )
}
