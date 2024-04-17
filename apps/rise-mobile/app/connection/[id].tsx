import { useConnection } from '@react-native-templates/app'
import { ConnectionScreen } from '@react-native-templates/app'
import { Stack } from 'expo-router'
import React from 'react'
import { createParam } from 'solito'

const { useParam } = createParam<{ id: string; path: string }>()

export default function Screen() {
  const [id] = useParam('id')
  const [path] = useParam('path')
  const [connection] = useConnection(id)

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
