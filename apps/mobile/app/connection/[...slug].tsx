import { Redirect, Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'

import { useConnection } from '../../src/connection'
import { ConnectionScreen } from '../../src/screens/connection'

export default function Screen() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>()
  const connection = useConnection(slug?.[0])

  if (!connection) {
    return <Redirect href="/connection/not-found" />
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: slug?.[1] || connection.label,
        }}
      />
      <ConnectionScreen connection={connection} path={slug?.[1]} />
    </>
  )
}
