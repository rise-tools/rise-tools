import { RiseComponents } from '@rise-tools/kit'
import { ActionDataState, Template } from '@rise-tools/react'
import { TamaguiComponents } from '@rise-tools/tamagui'
import { useToastController } from '@tamagui/toast'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback } from 'react'

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

type RiseAction =
  | ActionDataState<'navigate', { path: string }>
  | ActionDataState<'navigate-back'>
  | ActionDataState<'toast', { title: string; message?: string }>

function isRiseAction(action: ActionDataState): action is RiseAction {
  return ['navigate', 'navigate-back', 'toast'].includes(action.name)
}

function ActiveConnectionScreen({ connection }: { connection: Connection }) {
  const params = useLocalSearchParams<{ path: string }>()
  const toast = useToastController()
  const router = useRouter()

  const dataSource = useDataSource(connection.id, connection.host)
  if (!dataSource) {
    return null
  }

  const onAction = useCallback(
    (action: ActionDataState) => {
      if (!isRiseAction(action)) {
        return
      }
      if (action.name === 'navigate') {
        router.push(`/connection/${connection.id}?path=${action.path}`)
        return
      }
      if (action.name === 'navigate-back') {
        router.back()
        return
      }
      if (action.name === 'toast') {
        toast.show(action.title, { message: action.message })
        return
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
