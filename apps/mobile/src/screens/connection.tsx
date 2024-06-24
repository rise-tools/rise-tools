import { RiseComponents } from '@rise-tools/kit'
import {
  ExpoRouterComponents,
  FormComponents,
  LucideIconsComponents,
  QRCodeComponents,
  SVGComponents,
  TamaguiComponents,
  useExpoRouterActions,
  useHapticsActions,
  useLinkingActions,
  useToastActions,
} from '@rise-tools/kitchen-sink'
import { Rise } from '@rise-tools/react'
import React from 'react'

import { Connection } from '../connection'
import { DataBoundary } from '../data-boundary'
import { useModelSource } from '../model-sources'

const components = {
  ...TamaguiComponents,
  ...RiseComponents,
  ...ExpoRouterComponents,
  ...FormComponents,
  ...SVGComponents,
  ...LucideIconsComponents,
  ...QRCodeComponents,
}

export function ConnectionScreen({ connection, path }: { connection: Connection; path?: string }) {
  const actions = {
    ...useExpoRouterActions({ basePath: `/connection/${connection.id}` }),
    ...useToastActions(),
    ...useHapticsActions(),
    ...useLinkingActions(),
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
