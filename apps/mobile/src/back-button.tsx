import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Home, Pencil, Share } from '@tamagui/lucide-icons'
import { X } from '@tamagui/lucide-icons'
import { Platform } from 'react-native'
import { Button, ButtonProps, Image, Separator } from 'tamagui'

import { Connection, DEMO_CONNECTION } from './connection'
import { Dropdown, DropdownItem } from './dropdown'
import { RootStackParamList } from './screens'
import type { RiseStackParamList } from './screens/connection'

export function DismissButton() {
  const navigation = useNavigation<NavigationProp<RiseStackParamList>>()
  return (
    <HeaderButton onPress={() => navigation.goBack()} unstyled>
      <X />
    </HeaderButton>
  )
}

export function HeaderButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      unstyled
      style={Platform.select({
        ios: null,
        default: {
          marginVertical: 3,
          marginHorizontal: 11,
        },
      })}
    >
      {props.children}
    </Button>
  )
}

export function BackButton({ connection }: { connection?: Connection }) {
  const navigation = useNavigation<NavigationProp<RiseStackParamList & RootStackParamList>>()

  return (
    <Dropdown
      trigger={
        <HeaderButton>
          <Image src={require('../assets/RiseMainIcon.png')} aspectRatio={1} height={25} />
        </HeaderButton>
      }
    >
      <DropdownItem onPress={() => navigation.goBack()} Icon={Home}>
        Go Home
      </DropdownItem>
      <Separator />
      <DropdownItem onPress={() => navigation.navigate('qr-code')} Icon={Share}>
        Share Connection
      </DropdownItem>
      {connection && connection.id !== DEMO_CONNECTION.id && (
        <>
          <Separator />
          <DropdownItem
            onPress={() => navigation.navigate('edit-connection', { id: connection.id })}
            Icon={Pencil}
          >
            Edit Connection
          </DropdownItem>
        </>
      )}
    </Dropdown>
  )
}
