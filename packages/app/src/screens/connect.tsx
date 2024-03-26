import { Button, SizableText, YStack } from '@react-native-templates/demo-ui'
import { Connection, useConnections } from '@react-native-templates/app/src/provider/storage'
import bs58 from 'bs58'
import { Buffer } from 'buffer'
import { useEffect } from 'react'
import React from 'react'
import { useRouter } from 'solito/router'

export function ConnectScreen({ connectInfo }: { connectInfo?: string }) {
  const { replace } = useRouter()

  let importedConnection: null | Connection = null
  if (connectInfo) {
    try {
      importedConnection = JSON.parse(Buffer.from(bs58.decode(connectInfo)).toString('utf-8'))
    } catch (error) {
      console.error('Error parsing connection:', error)
    }
  }

  const [connState, { addConnection }] = useConnections()

  if (!importedConnection) {
    return (
      <YStack>
        <SizableText>Invalid Connection Info</SizableText>
      </YStack>
    )
  }
  useEffect(() => {
    // check if connection exists in connections, redirect if it does
    const existingConnection = connState.connections.find(
      (connection) =>
        connection.label === importedConnection?.label &&
        connection.host === importedConnection?.host &&
        connection.path === importedConnection?.path
    )
    if (existingConnection) {
      replace(`/connection/${existingConnection.id}`)
    }
    console.log('existingConnection', existingConnection)
  }, [importedConnection, connState])
  return (
    <YStack>
      <SizableText>Confirm Connection to "{importedConnection.label}"?</SizableText>
      {importedConnection && (
        <Button
          onPress={() => {
            if (!importedConnection) return
            const existingConnection = connState.connections.find(
              (connection) =>
                connection.label === importedConnection?.label &&
                connection.host === importedConnection?.host &&
                connection.path === importedConnection?.path
            )
            if (existingConnection) {
              replace(`/connection/${existingConnection.id}`)
            } else {
              const newConnId = addConnection(importedConnection)
              replace(`/connection/${newConnId}`)
            }
          }}
        >
          Connect
        </Button>
      )}
    </YStack>
  )
}
