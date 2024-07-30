import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useReactNavigationActions } from '@rise-tools/kit-react-navigation'
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

import { PRIVACY_POLICY_URL } from '../config'
import { Connection, connections, EXAMPLE_CONNECTION } from '../connection'
import { Dropdown, DropdownItem } from '../dropdown'
import { RootStackParamList } from '.'
import { RiseScreen } from './connection'

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
            {state.length > 0 && <ConnectionItem connection={EXAMPLE_CONNECTION} readonly />}
          </YGroup>
          <NewConnectionButton />
        </YStack>
        {state.length === 0 && <Examples />}
      </YStack>
    </ScrollView>
  )
}

function Examples() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const actions = {
    'rise-tools/kit-react-navigation/navigate': {
      action: ({ path, options }) => {
        navigation.navigate('connection', {
          id: 'example',
          path,
          options,
        })
      },
    },
  } satisfies ReturnType<typeof useReactNavigationActions>

  return <RiseScreen connection={EXAMPLE_CONNECTION} path="" actions={actions} />
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
          <Button
            backgroundColor="transparent"
            icon={Settings}
            onPress={() => navigation.push('edit-connection', { id: connection.id })}
            disabled={readonly}
            opacity={readonly ? 0 : 1}
          />
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
  return (
    <Dropdown trigger={<CircleEllipsis />}>
      <DropdownItem
        onPress={() => Linking.openURL('https://rise.tools/docs/playground/')}
        Icon={BookOpenText}
      >
        Docs
      </DropdownItem>
      <DropdownItem onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} Icon={VenetianMask}>
        Privacy Policy
      </DropdownItem>
    </Dropdown>
  )
}
