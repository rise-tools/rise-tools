import { useStream } from '@rise-tools/react'
import { PlusCircle, Settings } from '@tamagui/lucide-icons'
import { useAssets } from 'expo-asset'
import { useRouter } from 'expo-router'
import React from 'react'
import { ImageURISource, ScrollView } from 'react-native'
import { Button, Image, Separator, Text, View, XStack, YGroup, YStack } from 'tamagui'

import { BUILTIN_CONNECTIONS, Connection, connections } from '../connection'

export function HomeScreen() {
  const state = useStream(connections)

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <HeroImage />
        <YStack gap="$2">
          <YGroup separator={<Separator />}>
            {state.map((connection) => (
              <ConnectionItem key={connection.id} connection={connection} />
            ))}
          </YGroup>
          <NewConnectionButton />
        </YStack>
        {state.length === 0 && (
          <YStack gap="$2">
            <Text textAlign="center">or try some of the examples below:</Text>
            <YGroup separator={<Separator />}>
              {Object.values(BUILTIN_CONNECTIONS).map((connection) => (
                <ConnectionItem key={connection.id} connection={connection} readonly />
              ))}
            </YGroup>
          </YStack>
        )}
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

function ConnectionItem({
  connection,
  readonly = false,
}: {
  connection: Connection
  readonly?: boolean
}) {
  const router = useRouter()

  return (
    <YGroup.Item>
      <Button
        paddingHorizontal={0}
        backgroundColor="$color1"
        onPress={() => router.push(`/connection/${connection.id}?path=${connection.path}`)}
      >
        <XStack>
          <View flex={1} alignItems="center" justifyContent="center" paddingLeft="$4">
            <Text ellipsizeMode="clip" numberOfLines={1}>
              {connection.label}
            </Text>
          </View>
          {readonly ? (
            <Button disabled backgroundColor="transparent" />
          ) : (
            <Button
              backgroundColor="transparent"
              icon={Settings}
              onPress={() => router.push(`/edit-connection/${connection.id}`)}
            />
          )}
        </XStack>
      </Button>
    </YGroup.Item>
  )
}

function NewConnectionButton() {
  const router = useRouter()
  return (
    <Button onPress={() => router.push('/new-connection')} icon={PlusCircle} chromeless>
      Add new connection
    </Button>
  )
}
