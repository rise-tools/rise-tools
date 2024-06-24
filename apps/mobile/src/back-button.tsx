import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Home, Share } from '@tamagui/lucide-icons'
import { X } from '@tamagui/lucide-icons'
import * as Haptics from 'expo-haptics'
import { PropsWithChildren } from 'react'
import { Button, Group, Image, Popover, Separator, Text, XStack } from 'tamagui'

import type { RiseStackParamList } from './screens/connection'

export function DismissButton() {
  const navigation = useNavigation<NavigationProp<RiseStackParamList>>()
  return (
    <Button onPress={() => navigation.goBack()} unstyled>
      <X />
    </Button>
  )
}

export function BackButton() {
  const navigation = useNavigation<NavigationProp<RiseStackParamList>>()

  return (
    <Popover size="$5" offset={16} placement="bottom-start">
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
          <DropdownItem onPress={() => navigation.goBack()} Icon={Home}>
            Go Home
          </DropdownItem>
          <Separator />
          <DropdownItem onPress={() => navigation.navigate('qr-code')} Icon={Share}>
            Share Connection
          </DropdownItem>
        </Group>
      </Popover.Content>
    </Popover>
  )
}

function DropdownItem({
  children,
  onPress,
  Icon,
}: PropsWithChildren<{ onPress: () => void; Icon: React.ComponentType<any> }>) {
  return (
    <Group.Item>
      <Popover.Close flexDirection="row" justifyContent="flex-start" paddingHorizontal="$4" asChild>
        <Button
          backgroundColor="$backgroundStrong"
          onPress={() => {
            Haptics.impactAsync()
            onPress()
          }}
        >
          <XStack alignItems="center" gap="$3">
            <Icon size="$1" />
            <Text fontSize="$4">{children}</Text>
          </XStack>
        </Button>
      </Popover.Close>
    </Group.Item>
  )
}
