/**
 * Can't use "actions" in this context, because there is no way to access
 * the nearest context to the action on the client
 *
 * We should really figure this out - because it may turn out to be a challenge in context of nested
 * navigators as well.
 *
 * When you do "useNavigation()" from navigate() action, it will always run at the top-level, which is not desired.
 *
 * Ideally, there should be a way to access an arbitrary context value from within any level of the tree.
 *
 * The problem is that we run all actions at a top-level, so that's where we can read context values from.
 * A more robust solution would be to run that action at a level of component, so if it reads from context,
 * it accesses the nearest value.
 *
 * A simple solution would be to allow each action handler on the client to read from context (such as `useNavigation()`).
 * Not sure how to do this since it's a hook, but that would be the best.
 */

// import { action, ActionsDefinition } from '@rise-tools/react'
// import { VideoSource } from 'expo-video'

// export type ExpoVideoActions = ActionsDefinition<
//   [
//     ReturnType<typeof replace>,
//     ReturnType<typeof seekBy>,
//     ReturnType<typeof play>,
//     ReturnType<typeof pause>,
//   ]
// >

// export const replace = (source: VideoSource) =>
//   action('rise-tools/kit-expo-video/replace', { source })

// export const seekBy = (seconds: number) => action('rise-tools/kit-expo-video/seekBy', { seconds })

// export const play = () => action('rise-tools/kit-expo-video/play')

// export const pause = () => action('rise-tools/kit-expo-video/pause')

import { createComponentDefinition } from '@rise-tools/react'

import type * as t from './video'

export const VideoView = createComponentDefinition<typeof t.VideoView>(
  'rise-tools/kit-expo-view/VideoView'
)
export const Video = createComponentDefinition<typeof t.Video>('rise-tools/kit-expo-view/Video')
export const VideoActionButton = createComponentDefinition<typeof t.VideoActionButton>(
  'rise-tools/kit-expo-view/VideoActionButton'
)
