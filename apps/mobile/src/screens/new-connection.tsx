import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { Button, YStack } from 'tamagui'
import { z } from 'zod'

import { addConnection } from '../connection'
import { ConnectionForm } from '../connection-form'
import { LabelSchema } from '../form'
import { RootStackParamList } from '.'

const defaultNewConnection = {
  label: '' as z.infer<typeof LabelSchema>,
  host: '' as string,
  path: '',
}

export function NewConnectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'newConnection'>>()
  return (
    <YStack flex={1} padding="$4">
      <ConnectionForm
        onSubmit={(values) => {
          addConnection(values)
          navigation.navigate('home')
        }}
        defaultValues={defaultNewConnection}
        submitButton={({ submit }) => <Button onPress={() => submit()}>Add Connection</Button>}
      />
    </YStack>
  )
}
