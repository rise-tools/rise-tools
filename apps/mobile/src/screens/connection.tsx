import { RiseComponents } from '@rise-tools/kit
import { ExpoRouterComponents, useExpoRouterActions } from '@rise-tools/kit-expo-router'
import { useHapticsActions } from '@rise-tools/kit-haptics'
import { useToastActions } from '@rise-tools/kit-tamagui-toast'
import { Rise } from '@rise-tools/react'
import { TamaguiComponents } from '@rise-tools/tamagui'
import React from 'react'

import { Connection } from '../connection'
import { DataBoundary } from '../data-boundary'
import { useModelSource } from '../model-sources'

const components = {
  ...TamaguiComponents,
  ...RiseComponents,
  ...ExpoRouterComponents,
}

export function ConnectionScreen({ connection, path }: { connection: Connection; path?: string }) {
  const actions = {
    ...useExpoRouterActions({ basePath: `/connection/${connection.id}` }),
    ...useToastActions(),
    ...useHapticsActions(),
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
