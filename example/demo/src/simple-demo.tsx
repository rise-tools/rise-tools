import { Button, Text, YStack } from '@rise-tools/kit-tamagui/server'
import { createWSServer, state, view } from '@rise-tools/server'

const [count, setCount] = state(0)

const incrementer = view((get) => (
  <YStack>
    <Text>The count is {get(count)}</Text>
    <Button
      onPress={() => {
        setCount((c) => c + 1)
      }}
    >
      Plus 1
    </Button>
  </YStack>
))

createWSServer({ incrementer }, 8888)
