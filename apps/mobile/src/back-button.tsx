import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Home, Share } from '@tamagui/lucide-icons'
import { Button, Group, Image, Popover, Separator, Text } from 'tamagui'

import type { RiseStackParamList } from './screens/connection'

export function BackButton() {
  const navigation = useNavigation<NavigationProp<RiseStackParamList>>()

  return (
    <Popover size="$5" offset={15} placement="bottom-start">
      <Popover.Trigger>
        <Image src={require('../assets/RiseMainIcon.png')} aspectRatio={1} height={25} />
      </Popover.Trigger>
      <Popover.Content
        elevate
        borderWidth={1}
        borderColor="$borderColor"
        padding={0}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Group>
          <Group.Item>
            <Button
              backgroundColor="white"
              justifyContent="flex-start"
              onPress={() => navigation.navigate('qr-code')}
            >
              <Share />
              <Text>Share QR Code</Text>
            </Button>
          </Group.Item>
          <Separator />
          <Group.Item>
            <Button
              backgroundColor="white"
              justifyContent="flex-start"
              onPress={() => navigation.goBack()}
            >
              <Home />
              <Text>Go Home</Text>
            </Button>
          </Group.Item>
        </Group>
      </Popover.Content>
    </Popover>
  )
}
