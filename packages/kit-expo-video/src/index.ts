import { ComponentRegistry } from '@rise-tools/react'

import { Video, VideoActionButton, VideoView } from './video'

export const ExpoVideoComponents: ComponentRegistry = {
  'rise-tools/kit-expo-video/VideoView': {
    component: VideoView,
  },
  'rise-tools/kit-expo-view/Video': {
    component: Video,
  },
  'rise-tools/kit-expo-view/VideoActionButton': {
    component: VideoActionButton,
  },
}
