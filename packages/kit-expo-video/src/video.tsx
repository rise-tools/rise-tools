import { useVideoPlayer, VideoPlayer, VideoSource, VideoView, VideoViewProps } from 'expo-video'
import React, { useEffect, useRef } from 'react'

type VideoPlayerSettings = Partial<
  Pick<
    VideoPlayer,
    | 'currentTime'
    | 'loop'
    | 'muted'
    | 'playbackRate'
    | 'preservesPitch'
    | 'showNowPlayingNotification'
    | 'staysActiveInBackground'
    | 'volume'
  >
>

export function Video({
  source,
  autoplay = false,
  loop,
  muted,
  playbackRate,
  preservesPitch,
  showNowPlayingNotification,
  staysActiveInBackground,
  volume,
  ...props
}: { source: VideoSource; autoplay?: boolean } & VideoPlayerSettings &
  Omit<VideoViewProps, 'player'>) {
  const player = useVideoPlayer(source)

  useEffect(() => {
    if (muted !== undefined) player.muted = muted
    if (loop !== undefined) player.loop = loop
    if (playbackRate !== undefined) player.playbackRate = playbackRate
    if (preservesPitch !== undefined) player.preservesPitch = preservesPitch
    if (showNowPlayingNotification !== undefined)
      player.showNowPlayingNotification = showNowPlayingNotification
    if (staysActiveInBackground !== undefined)
      player.staysActiveInBackground = staysActiveInBackground
    if (volume !== undefined) player.volume = volume
  }, [
    muted,
    loop,
    playbackRate,
    preservesPitch,
    showNowPlayingNotification,
    staysActiveInBackground,
    volume,
  ])

  useEffect(() => {
    if (autoplay) {
      player.play()
    }
  })

  const video = useRef<VideoView>(null)

  return <VideoView ref={video} player={player} {...props} />
}
