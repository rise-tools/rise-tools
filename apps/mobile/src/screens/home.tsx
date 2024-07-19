import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useStream } from '@rise-tools/react'
import {
  BookOpenText,
  CircleEllipsis,
  PlusCircle,
  Settings,
  VenetianMask,
} from '@tamagui/lucide-icons'
import * as Linking from 'expo-linking'
import React from 'react'
import { ScrollView } from 'react-native'
import { Button, Image, Separator, Text, View, XStack, YGroup, YStack } from 'tamagui'

import { BUILTIN_CONNECTIONS, Connection, connections } from '../connection'
import { Dropdown, DropdownItem } from '../dropdown'
import { RootStackParamList } from '.'

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
  return (
    <XStack padding="$4" justifyContent="center">
      <View aspectRatio={1} height={200}>
        <Image source={require('../../assets/RiseMainIcon.png')} aspectRatio={1} height={200} />
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'home'>>()

  return (
    <YGroup.Item>
      <Button onPress={() => navigation.push('connection', { id: connection.id })}>
        <XStack>
          <View flex={1} alignItems="center" justifyContent="center">
            <Text ellipsizeMode="clip" numberOfLines={1}>
              {connection.label}
            </Text>
          </View>
          {!readonly && (
            <Button
              backgroundColor="transparent"
              icon={Settings}
              onPress={() => navigation.push('edit-connection', { id: connection.id })}
            />
          )}
        </XStack>
      </Button>
    </YGroup.Item>
  )
}

function NewConnectionButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'home'>>()
  return (
    <Button onPress={() => navigation.push('new-connection')} icon={PlusCircle} chromeless>
      Connect Rise Server
    </Button>
  )
}

export function HomeHeaderButton() {
  const privacyUrl = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL

  return (
    <Dropdown trigger={<CircleEllipsis />}>
      <DropdownItem
        onPress={() => Linking.openURL('https://rise.tools/docs/playground/')}
        Icon={BookOpenText}
      >
        Docs
      </DropdownItem>
      {privacyUrl && (
        <DropdownItem onPress={() => Linking.openURL(privacyUrl)} Icon={VenetianMask}>
          Privacy Policy
        </DropdownItem>
      )}
    </Dropdown>
  )
}
