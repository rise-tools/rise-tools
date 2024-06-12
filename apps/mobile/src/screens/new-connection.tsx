import { useRouter } from 'expo-router'
import React from 'react'
import { Button, YStack } from 'tamagui'

import { addConnection } from '../connection'
import { ConnectionForm } from '../connection-form'

export function NewConnectionScreen() {
  const router = useRouter()
  return (
    <YStack flex={1} space padding="$4">
      <ConnectionForm
        onSubmit={(values) => {
          addConnection(values)
          router.back()
        }}
        submitButton={({ submit }) => <Button onPress={() => submit()}>Add Connection</Button>}
      />
    </YStack>
  )
}

// rise://new-connection
