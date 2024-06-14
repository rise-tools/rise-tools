import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'

import { ConnectScreen } from '../../src/screens/connect'

export default function Screen() {
  const { connectInfo } = useLocalSearchParams<{ connectInfo: string }>()

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Connection',
        }}
      />
      <ConnectScreen connectInfo={connectInfo} />
    </>
  )
}
