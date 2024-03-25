import React from 'react'
import { ScrollView } from 'react-native'
import {
  Button,
  Image,
  Paragraph,
  Separator,
  Text,
  View,
  XStack,
  YGroup,
  YStack,
} from '@react-native-templates/demo-ui'
import { Connection, useConnections } from 'app/provider/storage'
import { useLink } from 'solito/link'
import { PlusCircle, Settings } from '@tamagui/lucide-icons'
import { useAssets } from 'expo-asset'

export function HomeScreen() {
  const [state, { addConnection }] = useConnections()

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <HeroImage />
        <YGroup separator={<Separator />}>
          {state.connections.map((connection) => (
            <ConnectionItem key={connection.id} connection={connection} />
          ))}
        </YGroup>
        <NewConnectionButton />
        {/* <Button
          color="$green10"
          chromeless
          onPress={() => {
            addConnection({ host: 'ws://10.255.1.59:3990', path: '', label: 'Test Connection' })
          }}
        >
          TEST - New Connection
        </Button> */}
      </YStack>
    </ScrollView>
  )
}

function HeroImage() {
  const [assets, error] = useAssets([require('../assets/RiseMainIcon.png')])
  if (error) console.error(error)
  if (!assets?.[0]) return null
  return (
    <XStack maxWidth={'100%'} jc="center">
      <View aspectRatio={1} height={200}>
        <Image source={assets[0]} aspectRatio={1} height={200} />
      </View>
    </XStack>
  )
}

function ConnectionItem({ connection }: { connection: Connection }) {
  const editLink = useLink({
    href: `/edit-connection/${connection.id}`,
  })
  const link = useLink({
    href: `/connection/${connection.id}`,
  })
  return (
    <YGroup.Item>
      <Button
        paddingHorizontal={0}
        backgroundColor={'$color1'}
        {...link}
        onLongPress={() => {
          editLink.onPress()
        }}
      >
        <XStack>
          <View f={1} ai="center" jc="center" paddingLeft={'$4'}>
            <Text ellipsizeMode="clip" numberOfLines={1}>
              {connection.label}
            </Text>
          </View>
          <Button backgroundColor={'transparent'} icon={Settings} {...editLink} />
        </XStack>
      </Button>
    </YGroup.Item>
  )
}

function NewConnectionButton() {
  const link = useLink({
    href: '/new-connection',
  })
  return (
    <Button {...link} icon={PlusCircle} chromeless>
      New Connection
    </Button>
  )
}
