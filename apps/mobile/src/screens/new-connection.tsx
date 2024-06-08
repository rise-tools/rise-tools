import React from 'react'
import { useLink } from 'solito/link'
import { Button, YStack } from 'tamagui'
import { z } from 'zod'

import { add } from '../connection'
import { ConnectionForm } from '../connection-form'
import { LabelSchema } from '../form'

const defaultNewConnection = {
  label: '' as z.infer<typeof LabelSchema>,
  host: '' as string,
  path: '',
}

export function NewConnectionScreen() {
  const goHomeLink = useLink({
    href: '/',
  })
  return (
    <YStack flex={1} space padding="$4">
      <ConnectionForm
        onSubmit={(values) => {
          add(values)
          goHomeLink.onPress()
        }}
        defaultValues={defaultNewConnection}
        submitButton={({ submit }) => <Button onPress={() => submit()}>Add Connection</Button>}
      />
    </YStack>
  )
}

// rise://new-connection
