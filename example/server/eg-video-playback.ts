import fs from 'fs'
import { createReadStream, read, stat } from 'fs-extra'
import { join } from 'path'
import { promisify } from 'util'
import zlib from 'zlib'

import { EGInfo } from './eg'
import { Frame } from './eg-sacn'
import { DBFile, DBState, readDb } from './eg-video'

export type VideoPlaybackInstance = {
  readFrame: () => Frame | null
  restart: () => void
  setParams: (params: PlaybackParams) => void
  frameCount: number
  playingFrame: number | null
  info: DBFile
}

export type VideoPlayer = {
  readFrame: () => Frame | null
  restart: () => void
  selectVideo: (videoId: string) => void
  id: string
  setParams: (params: PlaybackParams) => void
  getFrameCount: () => number | null
  getPlayingFrame: () => number | null
  getInfo: () => DBFile | null
}

export type PlaybackParams = {
  loopBounce?: boolean
  reverse?: boolean
}
const openFile = promisify(fs.open)

export type EGVideo = ReturnType<typeof egVideo>

export function egVideo(
  eg: EGInfo,
  mediaPath: string,
  {
    onMediaUpdate,
    onPlayerUpdate,
  }: {
    onMediaUpdate: (mediaDb: DBState) => void
    onPlayerUpdate: (player: VideoPlayer) => void
  }
) {
  const { frameSize } = eg

  let mediaDb: null | DBState = null

  async function updateDb() {
    mediaDb = await readDb(mediaPath)
    onMediaUpdate(mediaDb)
  }

  updateDb()

  setInterval(() => {
    updateDb()
  }, 5000)

  async function loadVideo(
    fileSha256: string,
    params: PlaybackParams = {}
  ): Promise<VideoPlaybackInstance> {
    const dbState = await readDb(mediaPath)
    const file = dbState.files.find((file) => file.fileSha256 === fileSha256)
    // console.log('will load video', file)

    let playbackParams: PlaybackParams = params
    const MAX_QUEUE_SIZE = 30
    const batchSize = 30

    let bufferQueue: Uint8Array[] = []
    let currentBuffer: Buffer = Buffer.alloc(0)
    let streamPaused = false
    let playCount = 0
    const framesFile = file?.egFramesFile
    if (!framesFile) {
      throw new Error('No frames file found for ' + fileSha256)
    }
    const framesFilePath = join(mediaPath, framesFile)
    const fileInfo = await stat(framesFilePath)
    // console.log('fileInfo', fileInfo)
    if (fileInfo.size % frameSize !== 0) {
      console.log('fileInfo.size', fileInfo.size)
      console.log('frameSize', frameSize)
      console.log('frame count', fileInfo.size / frameSize)
      throw new Error('File size is not an exact multiple of the frame size.')
    }
    const frameCount = fileInfo.size / frameSize
    let resume = () => {}
    let pause = () => {}

    async function startReadbackReverse() {
      playback.playingFrame = 0
      const readbackInstance = playCount++
      console.log('startReadbackReverse', readbackInstance)
      const fileHandle = await openFile(framesFilePath, 'r')

      const totalFrames = fileInfo.size / frameSize
      let currentFrameIndex = totalFrames - batchSize
      async function readFrames() {
        streamPaused = false
        const framesToRead = Math.min(batchSize, currentFrameIndex + 1)
        const buffer = Buffer.alloc(framesToRead * frameSize)
        const offset = currentFrameIndex * frameSize
        await read(fileHandle, buffer, 0, frameSize * framesToRead, offset)
        for (let i = 0; i < framesToRead; i++) {
          const frameBuffer = buffer.slice(i * frameSize, (i + 1) * frameSize)
          bufferQueue.unshift(new Uint8Array(frameBuffer))
        }
        currentFrameIndex -= framesToRead
        if (currentFrameIndex <= 0) {
          // end of reverse playback
          if (playbackParams.loopBounce) {
            startReadbackForward()
          } else if (playbackParams.reverse) {
            startReadbackReverse()
          } else {
            startReadbackForward()
          }
        }
        streamPaused = true
      }
      readFrames()
      pause = () => {}
      resume = async () => {
        await readFrames()
      }
    }

    function startReadbackForward() {
      playback.playingFrame = 0
      let totalBufferRead = 0
      const readbackInstance = playCount++
      console.log('startReadbackForward', readbackInstance)

      streamPaused = false

      const fileReadStream = createReadStream(framesFilePath, {})

      resume = () => {
        fileReadStream.resume()
        streamPaused = false
      }
      pause = () => {
        fileReadStream.pause()
        streamPaused = true
      }
      fileReadStream.on('data', (chunk: Buffer) => {
        totalBufferRead += chunk.length
        currentBuffer = Buffer.concat([currentBuffer, chunk])

        while (currentBuffer.length >= frameSize) {
          const bufferToProcess = currentBuffer.slice(0, frameSize)
          currentBuffer = currentBuffer.slice(frameSize)
          bufferQueue.push(new Uint8Array(bufferToProcess))
          if (bufferQueue.length >= MAX_QUEUE_SIZE && !streamPaused) {
            pause()
          }
        }
      })

      fileReadStream.on('end', () => {
        while (currentBuffer.length >= frameSize) {
          const bufferToProcess = currentBuffer.slice(0, frameSize)
          currentBuffer = currentBuffer.slice(frameSize)
          bufferQueue.push(new Uint8Array(bufferToProcess))
        }
        // end of forward playback
        if (playbackParams.loopBounce) {
          startReadbackReverse()
        } else if (playbackParams.reverse) {
          startReadbackReverse()
        } else {
          startReadbackForward()
        }
      })

      fileReadStream.on('error', (error: Error) => {
        console.error('Video playback fs error:', error)
      })
    }

    function restart() {
      pause()
      bufferQueue = []
      currentBuffer = Buffer.alloc(0)
      if (playbackParams.reverse) {
        startReadbackReverse()
      } else {
        startReadbackForward()
      }
    }
    function readFrame(): Frame | null {
      if (bufferQueue.length > 0) {
        if (playback.playingFrame != null) {
          playback.playingFrame = playback.playingFrame + 1
        }
        const frame = bufferQueue.shift()
        if (streamPaused && bufferQueue.length < MAX_QUEUE_SIZE) {
          resume()
        }
        return frame || null
      }
      return null
    }
    function setParams(params: PlaybackParams) {
      playbackParams = params
    }
    const playback: VideoPlaybackInstance = {
      readFrame,
      restart,
      setParams,
      frameCount,
      playingFrame: null,
      info: file,
    }
    if (playbackParams.reverse) {
      startReadbackReverse()
    } else {
      startReadbackForward()
    }
    return playback
  }

  function createPlayer(id: string): VideoPlayer {
    let activeVideo: string | null = null
    let videoInstance: VideoPlaybackInstance | null = null
    let playbackParams: PlaybackParams = {}
    function readFrame(): Frame | null {
      if (videoInstance) {
        const frame = videoInstance.readFrame()
        return frame
      }
      return null
    }
    async function selectVideo(videoId: string) {
      if (activeVideo !== videoId) {
        activeVideo = videoId
        await loadVideo(videoId, playbackParams).then((instance) => {
          videoInstance = instance
          onPlayerUpdate(player)
        })
      }
    }
    function restart() {
      if (videoInstance) {
        videoInstance.restart()
      }
    }
    function setParams(params: PlaybackParams) {
      playbackParams = params
      if (videoInstance) {
        videoInstance.setParams(params)
      }
    }
    function getFrameCount(): number | null {
      if (videoInstance) {
        return videoInstance.frameCount
      }
      return null
    }

    function getPlayingFrame(): number | null {
      if (videoInstance) {
        return videoInstance.playingFrame
      }
      return null
    }
    function getInfo(): DBFile | null {
      if (videoInstance) {
        return videoInstance.info
      }
      return null
    }
    const player: VideoPlayer = {
      readFrame,
      selectVideo,
      setParams,
      restart,
      getFrameCount,
      getPlayingFrame,
      getInfo,
      id,
    }

    return player
  }
  const players: Map<string, VideoPlayer> = new Map()
  function getPlayer(id: string): VideoPlayer {
    if (players.has(id)) {
      return players.get(id)!
    } else {
      const player = createPlayer(id)
      players.set(id, player)
      return player
    }
  }
  function incrementTime() {
    // todo, this is how we should handle the passage of time
  }

  return {
    loadVideo,
    updateDb,
    getDb() {
      return mediaDb
    },
    getTrackTitle(trackId: string) {
      const track = mediaDb?.files.find((file) => file.fileSha256 === trackId)
      return track?.title || trackId
    },
    getPlayer,
    incrementTime,
  }
}
