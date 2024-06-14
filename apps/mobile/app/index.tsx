import { Stack } from 'expo-router'
import React from 'react'

import { HomeScreen } from '../src/screens/home'

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
