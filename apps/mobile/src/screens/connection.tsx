import { RiseComponents } from '@rise-tools/kit'
import { useExpoRouterActions } from '@rise-tools/kit-expo-router'
import { useToastActions } from '@rise-tools/kit-tamagui-toast'
import { Rise } from '@rise-tools/react'
import { TamaguiComponents } from '@rise-tools/tamagui'
import { Stack } from 'expo-router'
import React from 'react'

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

export function ConnectionScreen({ connection, path }: { connection: Connection; path?: string }) {
  const actions = {
    ...useExpoRouterActions({ prefix: `/connection/${connection.id}` }),
    ...useToastActions(),
  }

  const modelSource = useModelSource(connection.id, connection.host)
  if (!modelSource) {
    return null
  }

  const resolvedPath = path || connection.path || ''

  return (
    <DataBoundary modelSource={modelSource} path={resolvedPath}>
      <Rise
        components={components}
        modelSource={modelSource}
        path={resolvedPath}
        actions={actions}
      />
    </DataBoundary>
  )
}
