import { NewConnectionScreen } from '@react-native-templates/app'
import { Stack } from 'expo-router'
import React from 'react'

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
