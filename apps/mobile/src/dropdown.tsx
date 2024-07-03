import { NavigationProp, useNavigation } from '@react-navigation/native'
import { X } from '@tamagui/lucide-icons'
import * as Haptics from 'expo-haptics'
import { PropsWithChildren } from 'react'
import { Platform } from 'react-native'
import { Button, Group, Popover, Text, XStack } from 'tamagui'

import type { RiseStackParamList } from './screens/connection'

export function DismissButton() {
  const navigation = useNavigation<NavigationProp<RiseStackParamList>>()
  return (
    <Button onPress={() => navigation.goBack()} unstyled>
      <X />
    </Button>
  )
}

export function Dropdown({ trigger, children }: PropsWithChildren<{ trigger: React.ReactNode }>) {
  return (
    <Popover
      size="$5"
      offset={Platform.select({
        ios: 16,
        default: 45,
      })}
      placement="bottom-start"
    >
      <Popover.Trigger onPress={() => Haptics.impactAsync()}>{trigger}</Popover.Trigger>
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
        <Group>{children}</Group>
      </Popover.Content>
    </Popover>
  )
}

export function DropdownItem({
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
