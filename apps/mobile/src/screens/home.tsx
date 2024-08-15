import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { useReactNavigationActions } from '@rise-tools/kit-react-navigation'
import { useStream } from '@rise-tools/react'
import { BookOpenText, CircleEllipsis, Settings, VenetianMask } from '@tamagui/lucide-icons'
import * as Linking from 'expo-linking'
import React from 'react'
import { ScrollView } from 'react-native'
import { Button, ButtonText, Image, Separator, Text, View, XStack, YGroup, YStack } from 'tamagui'

import { PRIVACY_POLICY_URL } from '../config'
import { Connection, connections, DEMO_CONNECTION } from '../connection'
import { Dropdown, DropdownItem } from '../dropdown'
import { RootStackParamList } from '.'
import { RiseScreen } from './connection'

export function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'home'>) {
  const state = useStream(connections)

  return (
    <ScrollView>
      <YStack padding="$4" gap="$2">
        <YStack gap="$4">
          <HeroImage />
          <YGroup separator={<Separator />}>
            {state.map((connection) => (
              <ConnectionItem key={connection.id} connection={connection} />
            ))}
          </YGroup>
          <Button onPress={() => navigation.push('new-connection')} theme="blue">
            Connect Rise Server
          </Button>
        </YStack>
        {state.length > 0 ? (
          <XStack justifyContent="center" gap="$2">
            <ButtonText
              onPress={() =>
                navigation.navigate('connection', {
                  id: DEMO_CONNECTION.id,
                })
              }
              textDecorationLine="underline"
              pressStyle={{
                color: 'black',
              }}
              color="$gray10"
              padding="$2"
            >
              Open Example UI
            </ButtonText>
            <ButtonText
              onPress={() => Linking.openURL('https://rise.tools/docs/playground/')}
              textDecorationLine="underline"
              pressStyle={{
                color: 'black',
              }}
              color="$gray10"
              padding="$2"
            >
              Open Documentation
            </ButtonText>
          </XStack>
        ) : (
          <Examples />
        )}
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
          id: DEMO_CONNECTION.id,
          path,
          options,
        })
      },
    },
  } satisfies ReturnType<typeof useReactNavigationActions>

  return <RiseScreen connection={DEMO_CONNECTION} actions={actions} />
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
