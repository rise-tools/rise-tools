import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'

import { useConnection } from '../../src/connection'
import { ConnectionScreen } from '../../src/screens/connection'

export default function Screen() {
  const { id, path } = useLocalSearchParams<{ id: string; path: string }>()
  const connection = useConnection(id)

  return (
    <>
      <Stack.Screen
        options={{
          title: path || connection?.label,
        }}
      />
      <ConnectionScreen />
    </>
  )
}
