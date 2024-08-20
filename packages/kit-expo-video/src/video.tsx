import { useVideoPlayer, VideoPlayer, VideoSource, VideoView, VideoViewProps } from 'expo-video'
import React, {
  ComponentProps,
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { TouchableOpacity } from 'react-native'

type VideoContext = {
  player: VideoPlayer
  video: MutableRefObject<VideoView | null>
}

const VideoContext = createContext<VideoContext>({
  get player(): never {
    throw new Error('Wrap your video with <Video /> component')
  },
  get video(): never {
    throw new Error('Wrap your video with <Video /> component')
  },
})

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

  return (
    <VideoContext.Provider value={{ player, video }}>
      <VideoView ref={video} player={player} {...props} />
    </VideoContext.Provider>
  )
}

// tbd: how do we choose the right Pressable for the user?
export function VideoActionButton({
  action,
  ...props
}: ComponentProps<typeof TouchableOpacity> & {
  action:
    | 'play'
    | 'pause'
    | ['replace', VideoSource]
    | ['seekBy', number]
    | 'enterFullScreen'
    | 'exitFullScreen'
    | 'startPictureInPicture'
    | 'stopPictureInPicture'
}) {
  const { player, video } = useContext(VideoContext)

  const [method, args] = Array.isArray(action) ? action : [action]

  return (
    <TouchableOpacity
      {...props}
      onPress={(e) => {
        props.onPress?.(e)

        if (method === 'replace') return player.replace(args)
        if (method === 'seekBy') return player.seekBy(args)
        if (method === 'play') return player.play()
        if (method === 'pause') return player.pause()

        if (!video.current) {
          console.warn('No <VideoView /> found. Make sure to render it within <Video /> component.')
          return
        }

        if (method === 'enterFullScreen') return video.current.enterFullscreen()
        if (method === 'exitFullScreen') return video.current.exitFullscreen()
        if (method === 'startPictureInPicture') return video.current.startPictureInPicture()
        if (method === 'stopPictureInPicture') return video.current.stopPictureInPicture()
      }}
    />
  )
}
