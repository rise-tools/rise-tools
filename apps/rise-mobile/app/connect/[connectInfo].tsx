import { ConnectScreen } from '@react-native-templates/app'
import { Stack } from 'expo-router'
import { createParam } from 'solito'
import React from 'react'

const { useParam } = createParam<{ connectInfo: string }>()

export default function Screen() {
  const [connectInfo] = useParam('connectInfo')

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
