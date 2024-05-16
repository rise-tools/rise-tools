import { Text, View } from '@final-ui/tamagui/server'

import { UIContext } from './types'

export function Example(ctx: UIContext) {
  console.log(ctx)
  return {
    // tbd: this should be lazy-loaded
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
  return (
    <View>
      <Text>Current value</Text>
    </View>
  )
}
