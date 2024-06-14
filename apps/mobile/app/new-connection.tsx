import { Stack } from 'expo-router'
import React from 'react'

import { NewConnectionScreen } from '../src/screens/new-connection'

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
