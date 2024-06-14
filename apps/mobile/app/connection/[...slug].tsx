import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'

import { useConnection } from '../../src/connection'
import { ConnectionScreen } from '../../src/screens/connection'
import { NotFoundScreen } from '../../src/screens/not-found'

export default function Screen() {
  const [id, ...segments] = useLocalSearchParams<{ slug: string[] }>().slug || []

  const connection = useConnection(id)
  const path = segments.join('/')

  if (!connection) {
    return <NotFoundScreen />
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: path || connection?.label,
        }}
      />
      <ConnectionScreen connection={connection} path={path} />
    </>
  )
}
