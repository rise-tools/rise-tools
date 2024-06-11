import { RiseComponents } from '@rise-tools/kit'
import { ActionDataState, Template } from '@rise-tools/react'
import { TamaguiComponents } from '@rise-tools/tamagui'
import { useToastController } from '@tamagui/toast'
import { Stack, useLocalSearchParams } from 'expo-router'
import React, { useCallback } from 'react'
import { useRouter } from 'solito/router'

import { Connection, useConnection } from '../connection'
import { DataBoundary } from '../data-boundary'
import { useDataSource } from '../data-sources'
import { NotFoundScreen } from './not-found'

export function Screen(props: { title: string }) {
  return <Stack.Screen options={{ title: props.title }} />
}

const components = {
  ...TamaguiComponents,
  ...RiseComponents,
  Screen: {
    component: Screen,
    validate: (props: any) => props,
  },
}

export function ConnectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const connection = useConnection(id)
  if (!connection) {
    return <NotFoundScreen />
  }

  return <ActiveConnectionScreen connection={connection} />
}

type NavigationAction = ActionDataState<'navigate', { path: string }>
type NavigationBackAction = ActionDataState<'navigate-back'>
type ShowToastAction = ActionDataState<'toast', { title: string; message?: string }>

type RiseAction = NavigationAction | NavigationBackAction | ShowToastAction

function ActiveConnectionScreen({ connection }: { connection: Connection }) {
  const params = useLocalSearchParams<{ path: string }>()
  const toast = useToastController()
  const router = useRouter()

  const dataSource = useDataSource(connection.id, connection.host)
  if (!dataSource) {
    return null
  }

  const onAction = useCallback(
    (action: RiseAction) => {
      if (action.name === 'navigate') {
        router.push(`/connection/${connection.id}?path=${action.path}`)
        return true
      }
      if (action.name === 'navigate-back') {
        router.back()
        return true
      }
      if (action.name === 'toast') {
        toast.show(action.title, { message: action.message })
        return true
      }
    },
    [router]
  )

  const path = params.path || connection.path || ''

  return (
    <DataBoundary dataSource={dataSource} path={path}>
      <Template components={components} dataSource={dataSource} path={path} onAction={onAction} />
    </DataBoundary>
  )
}
