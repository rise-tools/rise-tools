import { CommonActions } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useStream } from '@rise-tools/react'
import bs58 from 'bs58'
import { Buffer } from 'buffer'
import { useEffect } from 'react'
import React from 'react'
import { SizableText, YStack } from 'tamagui'

import { addConnection, Connection, connections } from '../connection'
import { RootStackParamList } from '.'

export function ConnectScreen({
  route: {
    params: { connectInfo },
  },
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'connect'>) {
  let importedConnection: Connection | null = null
  if (connectInfo) {
    try {
      importedConnection = JSON.parse(Buffer.from(bs58.decode(connectInfo)).toString('utf-8'))
    } catch (error) {
      console.error('Error parsing connection:', error)
    }
  }

  const state = useStream(connections)

  if (!importedConnection) {
    return (
      <YStack>
        <SizableText>Invalid Connection Info</SizableText>
      </YStack>
    )
  }

  useEffect(() => {
    const existingConnection = state.find(
      (connection) =>
        connection.label === importedConnection?.label &&
        connection.host === importedConnection?.host &&
        connection.path === importedConnection?.path
    )
    const id = existingConnection?.id || addConnection(importedConnection)
    navigation.dispatch(
      CommonActions.reset({
        routes: [
          { name: 'home' },
          {
            name: 'connection',
            params: { id },
          },
        ],
      })
    )
  }, [])

  return null
}
