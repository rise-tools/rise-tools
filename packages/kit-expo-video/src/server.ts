import { createComponentDefinition } from '@rise-tools/react'

import type * as t from './video'

export const Video = createComponentDefinition<typeof t.Video>('rise-tools/kit-expo-video/Video')
export const VideoActionButton = createComponentDefinition<typeof t.VideoActionButton>(
  'rise-tools/kit-expo-video/VideoActionButton'
)
