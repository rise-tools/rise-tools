import { Redirect, Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'

import { useConnection } from '../../src/connection'
import { ConnectionScreen } from '../../src/screens/connection'

export default function Screen() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>()

  const [id, ...segments] = slug || []

  const connection = useConnection(id)
  if (!connection) {
    return <Redirect href="/connection/not-found" />
  }

  const path = segments.join('/')

  return (
    <>
      <Stack.Screen
        options={{
          title: path || connection.label,
        }}
      />
      <ConnectionScreen connection={connection} path={path} />
    </>
  )
}
