import { RiseComponents } from '@rise-tools/kit'
import { ActionDataState, Template } from '@rise-tools/react'
import { TamaguiComponents } from '@rise-tools/tamagui'
import { useToastController } from '@tamagui/toast'
import { Stack } from 'expo-router'
import React, { useCallback } from 'react'
import { useRouter } from 'solito/router'

import { Connection } from '../connection'
import { DataBoundary } from '../data-boundary'
import { useDataSource } from '../data-sources'

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

type RiseAction =
  | ActionDataState<'navigate', { path: string }>
  | ActionDataState<'navigate-back'>
  | ActionDataState<'toast', { title: string; message?: string }>

function isRiseAction(action: ActionDataState): action is RiseAction {
  return ['navigate', 'navigate-back', 'toast'].includes(action.name)
}

export function ConnectionScreen({
  connection,
  path = (connection.path = ''),
}: {
  connection: Connection
  path?: string
}) {
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
        router.push(`/connection/${connection.id}/${action.path}`)
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

  return (
    <DataBoundary dataSource={dataSource} path={path}>
      <Template components={components} dataSource={dataSource} path={path} onAction={onAction} />
    </DataBoundary>
  )
}
