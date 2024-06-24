import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Copy, Trash } from '@tamagui/lucide-icons'
import bs58 from 'bs58'
import { Buffer } from 'buffer'
import { setStringAsync } from 'expo-clipboard'
import React from 'react'
import { Button, Separator, YStack } from 'tamagui'

import { removeConnection, updateConnection, useConnection } from '../connection'
import { ConnectionForm } from '../connection-form'
import { RootStackParamList } from '.'
import { NotFoundScreen } from './not-found'

export function EditConnectionScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'editConnection'>) {
  const connection = useConnection(route.params.id)
  if (!connection) {
    return <NotFoundScreen />
  }

  return (
    <YStack flex={1} padding="$4">
      <ConnectionForm
        onSubmit={(values) => {
          updateConnection(connection.id, { ...connection, ...values })
          navigation.navigate('home')
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
          navigation.navigate('home')
        }}
        chromeless
        icon={Trash}
      >
        Delete "{connection.label}" Connection
      </Button>
    </YStack>
  )
}
