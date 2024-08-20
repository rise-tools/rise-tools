import type {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RiseComponents } from '@rise-tools/kit'
import {
  ReactNavigationComponents,
  useReactNavigationActions,
} from '@rise-tools/kit-react-navigation'
import {
  ExpoVideoComponents,
  FormComponents,
  LucideIconsComponents,
  QRCodeComponents,
  SVGComponents,
  TamaguiComponents,
  useHapticsActions,
  useLinkingActions,
  useToastActions,
  WebViewComponents,
} from '@rise-tools/kitchen-sink'
import { Rise } from '@rise-tools/react'
import React, { useEffect } from 'react'

import { BackButton, DismissButton } from '../back-button'
import { Connection, touchConnection, useConnection } from '../connection'
import { DataBoundary } from '../data-boundary'
import { useModelSource } from '../model-sources'
import { RootStackParamList } from '.'
import { NotFoundScreen } from './not-found'
import { QRCodeScreen } from './qr-code'

const components = {
  ...TamaguiComponents,
  ...RiseComponents,
  ...FormComponents,
  ...SVGComponents,
  ...LucideIconsComponents,
  ...QRCodeComponents,
  ...ReactNavigationComponents,
  ...WebViewComponents,
  ...ExpoVideoComponents,
}

export type RiseStackParamList = {
  index: undefined
  rise: { path: string; options?: NativeStackNavigationOptions }
  'qr-code': undefined
  'not-found': undefined
}

const Stack = createNativeStackNavigator<RiseStackParamList>()

export function ConnectionScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'connection'>) {
  const connection = useConnection(route.params.id)
  const initialRoute = connection ? 'index' : 'not-found'

  useEffect(
    () =>
      navigation.addListener('transitionEnd', () => {
        touchConnection(route.params.id)
      }),
    []
  )

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <BackButton connection={connection} />,
          title: connection?.label || connection?.path,
          ...(route.params.options || {}),
        }}
      >
        {() => <RiseScreen connection={connection!} path={route.params.path} />}
      </Stack.Screen>
      <Stack.Screen
        name="rise"
        getId={({ params }) => params.path}
        options={({ route }) => route.params.options || {}}
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

export function RiseScreen({
  connection,
  path = connection.path,
  actions = {},
}: {
  connection: Connection
  path?: string
  actions?: Record<string, any>
}) {
  const modelSource = useModelSource(connection.id, connection.host)
  return (
    <DataBoundary modelSource={modelSource} path={path}>
      <Rise
        components={components}
        modelSource={modelSource}
        path={path}
        actions={{
          ...useReactNavigationActions({ routeName: 'rise' }),
          ...useToastActions(),
          ...useHapticsActions(),
          ...useLinkingActions(),
          ...actions,
        }}
      />
    </DataBoundary>
  )
}
