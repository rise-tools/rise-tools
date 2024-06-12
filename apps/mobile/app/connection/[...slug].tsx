import { NotFoundScreen } from 'apps/mobile/src/screens/not-found'
import { Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'

import { useConnection } from '../../src/connection'
import { ConnectionScreen } from '../../src/screens/connection'

export default function Screen() {
  const { slug } = useLocalSearchParams<{ slug: [string, string] }>()

  const connection = useConnection(slug?.[0])
  return (
    <>
      <Stack.Screen
        options={{
          title: slug?.[1] || connection?.label,
        }}
      />
      {connection ? (
        <ConnectionScreen connection={connection} path={slug?.[1]} />
      ) : (
        <NotFoundScreen />
      )}
    </>
  )
}
