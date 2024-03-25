import { Button, YStack } from '@react-native-templates/demo-ui'
import { ConnectionForm } from 'app/src/connection-form'
import { useConnections } from 'app/src/provider/storage'
import React from 'react'
import { useLink } from 'solito/link'

const defaultNewConnection = {
  label: '',
  host: '',
  path: '',
}

export function NewConnectionScreen() {
  const goHomeLink = useLink({
    href: '/',
  })
  const [, { addConnection }] = useConnections()
  return (
    <YStack f={1} space padding="$4">
      <ConnectionForm
        onSubmit={(values) => {
          // @ts-ignore
          addConnection(values)
          goHomeLink.onPress()
        }}
        defaultValues={defaultNewConnection}
        submitButton={({ submit }) => <Button onPress={() => submit()}>Add Connection</Button>}
      />
    </YStack>
  )
}

// rise://new-connection
