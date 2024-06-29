import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Home, Pencil, Share } from '@tamagui/lucide-icons'
import { X } from '@tamagui/lucide-icons'
import { Button, Image, Separator } from 'tamagui'

import { BUILTIN_CONNECTIONS, Connection } from './connection'
import { Dropdown, DropdownItem } from './dropdown'
import { RootStackParamList } from './screens'
import type { RiseStackParamList } from './screens/connection'

export function DismissButton() {
  const navigation = useNavigation<NavigationProp<RiseStackParamList>>()
  return (
    <Button onPress={() => navigation.goBack()} unstyled>
      <X />
    </Button>
  )
}

export function BackButton({ connection }: { connection?: Connection }) {
  const navigation = useNavigation<NavigationProp<RiseStackParamList & RootStackParamList>>()

  return (
    <Dropdown
      trigger={<Image src={require('../assets/RiseMainIcon.png')} aspectRatio={1} height={25} />}
    >
      <DropdownItem onPress={() => navigation.goBack()} Icon={Home}>
        Go Home
      </DropdownItem>
      <Separator />
      <DropdownItem onPress={() => navigation.navigate('qr-code')} Icon={Share}>
        Share Connection
      </DropdownItem>
      {connection && Object.keys(BUILTIN_CONNECTIONS).includes(connection.id) === false && (
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
