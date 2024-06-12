import { Copy, Trash } from '@tamagui/lucide-icons'
import bs58 from 'bs58'
import { Buffer } from 'buffer'
import { setStringAsync } from 'expo-clipboard'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Button, Separator, YStack } from 'tamagui'

import { removeConnection, updateConnection, useConnection } from '../connection'
import { ConnectionForm } from '../connection-form'
import { NotFoundScreen } from './not-found'

export function EditConnectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const connection = useConnection(id)
  const router = useRouter()

  if (!connection) {
    return <NotFoundScreen />
  }

  return (
    <YStack flex={1} padding="$4">
      <ConnectionForm
        onSubmit={(values) => {
          updateConnection(connection.id, { ...connection, ...values })
          router.back()
        }}
        defaultValues={connection}
        submitButton={({ submit }) => <Button onPress={() => submit()}>Save Connection</Button>}
      />
      <Separator />
      <Button
        onPress={() => {
          const connectionString = bs58.encode(Buffer.from(JSON.stringify(connection)))
          setStringAsync(`rise://connect/${connectionString}`)
        }}
        theme="green"
        icon={Copy}
      >
        Copy Connection Link
      </Button>
      <Button
        theme="red"
        color="$red10"
        onPress={() => {
          removeConnection(connection.id)
          router.back()
        }}
        chromeless
        icon={Trash}
      >
        {`Delete "${connection.label}" Connection`}
      </Button>
    </YStack>
  )
}
// rise://connect/3PDaRnc1CoGkXf4HiDu8JnBuU8bdm1ohJLfwhZTNTwN4h5Po6VMDhyUpS9zpEvizipY7KnGWBn68CV9rRz8r6cHbQLVHgktpPsd9ZgCLj8X2AT1eTwJowZ9hqYN3fNSZyy57WXxkfKku4Pi4
