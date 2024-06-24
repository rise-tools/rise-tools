import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import { ConnectScreen } from './connect'
import { ConnectionScreen } from './connection'
import { EditConnectionScreen } from './edit-connection'
import { HomeScreen } from './home'
import { NewConnectionScreen } from './new-connection'

export type RootStackParamList = {
  home: undefined
  connect: { connectInfo?: string }
  connection: { id: string }
  editConnection: { id: string }
  newConnection: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function Screens() {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="home" component={HomeScreen} options={{ title: 'Rise' }} />
      <Stack.Screen
        name="connect"
        component={ConnectScreen}
        options={{ title: 'Add Connection' }}
      />
      <Stack.Screen
        name="connection"
        component={ConnectionScreen}
        options={{
          presentation: 'fullScreenModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="editConnection"
        component={EditConnectionScreen}
        options={{ title: 'Edit Connection' }}
      />
      <Stack.Screen
        name="newConnection"
        component={NewConnectionScreen}
        options={{ title: 'New Connection' }}
      />
    </Stack.Navigator>
  )
}
