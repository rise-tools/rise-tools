import { PlusCircle, Settings } from '@tamagui/lucide-icons'
import { useAssets } from 'expo-asset'
import React from 'react'
import { ImageURISource, ScrollView } from 'react-native'
import { useLink } from 'solito/link'
import { Button, Image, Separator, Text, View, XStack, YGroup, YStack } from 'tamagui'

import { Connection, useConnections } from '../provider/storage'

export function HomeScreen() {
  const [state] = useConnections()
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
  const [assets, error] = useAssets([require('../../assets/RiseMainIcon.png')])
  if (error) console.error(error)
  if (!assets?.[0]) return null
  return (
    <XStack maxWidth={'100%'} justifyContent="center">
      <View aspectRatio={1} height={200}>
        <Image source={assets[0] as ImageURISource} aspectRatio={1} height={200} />
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
          <View flex={1} alignItems="center" justifyContent="center" paddingLeft={'$4'}>
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
