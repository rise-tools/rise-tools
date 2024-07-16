import { navigate } from '@rise-tools/kit-react-navigation/server'
import { Button, H1, YStack } from '@rise-tools/kitchen-sink/server'

export const models = {
  '': UI,
}

export function UI() {
  return (
    <YStack gap="$4" backgroundColor="$background">
      <H1>Welcome to React Navigation template</H1>
      <Button onPress={navigate('info')}>Click here to navigate!</Button>
    </YStack>
  )
}
