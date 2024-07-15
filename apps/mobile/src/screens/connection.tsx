import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RiseComponents } from '@rise-tools/kit'
import {
  useReactNavigationActions,
  useReactNavigationStackComponents,
} from '@rise-tools/kit-react-navigation'
import {
  FormComponents,
  LucideIconsComponents,
  QRCodeComponents,
  SVGComponents,
  TamaguiComponents,
  useHapticsActions,
  useLinkingActions,
  useToastActions,
} from '@rise-tools/kitchen-sink'
import { Rise } from '@rise-tools/react'
import React from 'react'

import { BackButton, DismissButton } from '../back-button'
import { Connection, useConnection } from '../connection'
import { DataBoundary } from '../data-boundary'
import { useModelSource } from '../model-sources'
import { RootStackParamList } from '.'
import { NotFoundScreen } from './not-found'
import { QRCodeScreen } from './qr-code'

export type RiseStackParamList = {
  index: undefined
  rise: { path: string }
  'qr-code': undefined
  'not-found': undefined
}

const Stack = createNativeStackNavigator<RiseStackParamList>()

export function ConnectionScreen({
  route,
}: NativeStackScreenProps<RootStackParamList, 'connection'>) {
  const connection = useConnection(route.params.id)
  const initialRoute = connection ? 'index' : 'not-found'
  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <BackButton connection={connection} />,
          title: connection?.label || connection?.path,
        }}
      >
        {() => <RiseScreen connection={connection!} path={connection!.path || ''} />}
      </Stack.Screen>
      <Stack.Screen
        name="rise"
        getId={({ params }) => params.path}
        options={({ route }) => ({
          title: route.params.path,
        })}
      >
        {({ route }) => <RiseScreen connection={connection!} path={route.params.path} />}
      </Stack.Screen>
      <Stack.Screen
        name="qr-code"
        options={{
          title: 'Share Connection',
          presentation: 'modal',
          headerLeft: DismissButton,
        }}
      >
        {() => <QRCodeScreen connection={connection!} />}
      </Stack.Screen>
      <Stack.Screen
        name="not-found"
        component={NotFoundScreen}
        options={{
          headerLeft: () => <BackButton connection={connection} />,
          title: 'Not Found',
        }}
      />
    </Stack.Navigator>
  )
}

function RiseScreen({ connection, path }: { connection: Connection; path: string }) {
  const modelSource = useModelSource(connection.id, connection.host)
  const actions = {
    ...useReactNavigationActions({ routeName: '' }),
    ...useToastActions(),
    ...useHapticsActions(),
    ...useLinkingActions(),
  }
  const components = {
    ...TamaguiComponents,
    ...RiseComponents,
    ...FormComponents,
    ...SVGComponents,
    ...LucideIconsComponents,
    ...QRCodeComponents,
    ...useReactNavigationStackComponents({
      render: (name) => <RiseScreen connection={connection} path={name} />,
    }),
  }
  return (
    <DataBoundary modelSource={modelSource} path={path}>
      <Rise components={components} modelSource={modelSource} path={path} actions={actions} />
    </DataBoundary>
  )
}
