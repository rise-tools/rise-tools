import { Text, View } from '@final-ui/tamagui/server'

import { UIContext } from './types'

export function Example(ctx: UIContext) {
  console.log(ctx)
  return {
    '': <Root />,
    '/user': <User />,
  }
}

function User() {
  return (
    <View>
      <Text>User</Text>
    </View>
  )
}

function Root() {
  // this either needs to receive a function or need a model with some context to be able
  // to access cloudflare durable object or any other storage from context
  return (
    <View>
      <Text>Current value</Text>
    </View>
  )
}
