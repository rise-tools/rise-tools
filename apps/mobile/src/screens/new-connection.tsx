import { useRouter } from 'expo-router'
import React from 'react'
import { Button, YStack } from 'tamagui'
import { z } from 'zod'

import { addConnection } from '../connection'
import { ConnectionForm } from '../connection-form'
import { LabelSchema } from '../form'

const defaultNewConnection = {
  label: '' as z.infer<typeof LabelSchema>,
  host: '' as string,
  path: '',
}

export function NewConnectionScreen() {
  const router = useRouter()
  return (
    <YStack flex={1} space padding="$4">
      <ConnectionForm
        onSubmit={(values) => {
          addConnection(values)
          router.navigate('/')
        }}
        defaultValues={defaultNewConnection}
        submitButton={({ submit }) => <Button onPress={() => submit()}>Add Connection</Button>}
      />
    </YStack>
  )
}

// rise://new-connection
