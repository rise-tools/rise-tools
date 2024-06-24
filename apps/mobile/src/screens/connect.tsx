import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useStream } from '@rise-tools/react'
import bs58 from 'bs58'
import { Buffer } from 'buffer'
import { useEffect } from 'react'
import React from 'react'
import { Button, SizableText, YStack } from 'tamagui'

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
    // check if connection exists in connections, redirect if it does
    const existingConnection = state.find(
      (connection) =>
        connection.label === importedConnection?.label &&
        connection.host === importedConnection?.host &&
        connection.path === importedConnection?.path
    )
    if (existingConnection) {
      navigation.replace('connection', { id: existingConnection.id })
    }
    console.log('existingConnection', existingConnection)
  }, [importedConnection, state])

  return (
    <YStack>
      <SizableText>Confirm Connection to "{importedConnection.label}"?</SizableText>
      {importedConnection && (
        <Button
          onPress={() => {
            if (!importedConnection) return
            const existingConnection = state.find(
              (connection) =>
                connection.label === importedConnection?.label &&
                connection.host === importedConnection?.host &&
                connection.path === importedConnection?.path
            )
            if (existingConnection) {
              navigation.replace('connection', { id: existingConnection.id })
            } else {
              const newConnId = addConnection(importedConnection)
              navigation.replace('connection', { id: newConnId })
            }
          }}
        >
          Connect
        </Button>
      )}
    </YStack>
  )
}
