import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RiseComponents } from '@rise-tools/kit'
import {
  FormComponents,
  LucideIconsComponents,
  QRCodeComponents,
  SVGComponents,
  TamaguiComponents,
  useHapticsActions,
  useLinkingActions,
  useReactNavigationActions,
  useToastActions,
} from '@rise-tools/kitchen-sink'
import { Rise } from '@rise-tools/react'
import React from 'react'

import { BackButton } from '../back-button'
import { useConnection } from '../connection'
import { DataBoundary } from '../data-boundary'
import { useModelSource } from '../model-sources'
import { RootStackParamList } from '.'
import { NotFoundScreen } from './not-found'

const components = {
  ...TamaguiComponents,
  ...RiseComponents,
  ...FormComponents,
  ...SVGComponents,
  ...LucideIconsComponents,
  ...QRCodeComponents,
}

type RiseStackParamList = {
  index: { id: string; path: string }
  rise: { id: string; path: string }
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
        component={RiseScreen}
        initialParams={{
          id: route.params.id,
          path: connection?.path || '',
        }}
        options={{
          headerLeft: BackButton,
          title: connection?.label || connection?.path,
        }}
      />
      <Stack.Screen
        name="rise"
        component={RiseScreen}
        getId={({ params }) => params.path}
        initialParams={{
          id: route.params.id,
        }}
        options={({ route }) => ({
          title: route.params.path,
        })}
      />
      <Stack.Screen
        name="not-found"
        component={NotFoundScreen}
        options={{
          headerLeft: BackButton,
          title: 'Not Found',
        }}
      />
    </Stack.Navigator>
  )
}

function RiseScreen({ route }: NativeStackScreenProps<RiseStackParamList, 'rise' | 'index'>) {
  const actions = {
    ...useReactNavigationActions({ routeName: 'rise' }),
    ...useToastActions(),
    ...useHapticsActions(),
    ...useLinkingActions(),
  }

  const connection = useConnection(route.params.id)!
  const modelSource = useModelSource(connection.id, connection.host)

  return (
    <DataBoundary modelSource={modelSource} path={route.params.path}>
      <Rise
        components={components}
        modelSource={modelSource}
        path={route.params.path}
        actions={actions}
      />
    </DataBoundary>
  )
}
