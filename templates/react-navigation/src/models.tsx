import { goBack, navigate } from '@rise-tools/kit-react-navigation/server'
import { Button, H1, Text, YStack } from '@rise-tools/kitchen-sink/server'

export const models = {
  '': UI,
  info: Info,
}

export function UI() {
  return (
    <YStack gap="$4" backgroundColor="$background">
      <H1>Welcome to React Navigation template</H1>
      <Button onPress={navigate('info')}>Click here to navigate!</Button>
    </YStack>
  )
}

function Info() {
  return (
    <YStack>
      <H1>Hello World!</H1>
      <Text>You just navigated to a server-defined screen. How cool is that?</Text>
      <Button onPress={goBack()}>Go back!</Button>
    </YStack>
  )
}
