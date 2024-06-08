import { Stack } from 'expo-router'
import React from 'react'

import { EditConnectionScreen } from '../../src/screens/edit-connection'

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
