import { RiseComponents } from '@rise-tools/kit'
import { ActionModelState, Rise } from '@rise-tools/react'
import { TamaguiComponents } from '@rise-tools/tamagui'
import { useToastController } from '@tamagui/toast'
import { Stack } from 'expo-router'
import React, { useCallback } from 'react'
import { useRouter } from 'solito/router'

import { Connection } from '../connection'
import { DataBoundary } from '../data-boundary'
import { useModelSource } from '../model-sources'

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
  | ActionModelState<'navigate', { path: string }>
  | ActionModelState<'navigate-back'>
  | ActionModelState<'toast', { title: string; message?: string }>

function isRiseAction(action: ActionModelState): action is RiseAction {
  return ['navigate', 'navigate-back', 'toast'].includes(action.name)
}

export function ConnectionScreen({ connection, path }: { connection: Connection; path?: string }) {
  const toast = useToastController()
  const router = useRouter()

  const modelSource = useModelSource(connection.id, connection.host)
  if (!modelSource) {
    return null
  }

  const onAction = useCallback(
    (action: ActionModelState) => {
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

  const resolvedPath = path || connection.path || ''

  return (
    <DataBoundary modelSource={modelSource} path={resolvedPath}>
      <Rise
        components={components}
        modelSource={modelSource}
        path={resolvedPath}
        onAction={onAction}
      />
    </DataBoundary>
  )
}
