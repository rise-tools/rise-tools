import { Button, YStack } from '@react-native-templates/demo-ui'
import { useConnection } from 'app/provider/storage'
import React from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { NotFoundScreen } from './not-found'
import { ConnectionForm } from 'app/src/connection-form'

const { useParam } = createParam<{ id: string }>()

export function EditConnectionScreen() {
  const [id] = useParam('id')
  const [connection, { remove, update }] = useConnection(id)
  const goHomeLink = useLink({
    href: '/',
  })
  if (!connection) return <NotFoundScreen />
  return (
    <YStack f={1} space padding="$4">
      <ConnectionForm
        onSubmit={(values) => {
          update((conn) => ({ ...conn, ...values }))
          goHomeLink.onPress()
        }}
        defaultValues={connection}
        submitButton={({ submit }) => <Button onPress={() => submit()}>Save Connection</Button>}
      />
      <Button
        theme="red"
        color="$red10"
        onPress={() => {
          remove()
          goHomeLink.onPress()
        }}
        chromeless
      >
        {`Delete "${connection.label}" Connection`}
      </Button>
    </YStack>
  )
}
