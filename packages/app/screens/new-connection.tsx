import { Button, YStack } from '@react-native-templates/demo-ui'
import { useLink } from 'solito/link'
import { useConnections } from 'app/provider/storage'
import { ConnectionForm } from 'app/src/connection-form'
import React from 'react'

const defaultNewConnection = {
  label: '',
  host: '',
  path: '',
}

export function NewConnectionScreen() {
  const goHomeLink = useLink({
    href: '/',
  })
  const [connections, { addConnection }] = useConnections()
  return (
    <YStack f={1} space padding="$4">
      <ConnectionForm
        onSubmit={(values) => {
          addConnection(values)
          goHomeLink.onPress()
        }}
        defaultValues={defaultNewConnection}
        submitButton={({ submit }) => <Button onPress={() => submit()}>Add Connection</Button>}
      />
    </YStack>
  )
}
