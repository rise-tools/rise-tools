import { createReadStream, read, stat } from 'fs-extra'
import { EGInfo } from './eg'
import { DBState, readDb } from './eg-video'
import { Frame } from './eg-sacn'
import { join } from 'path'

export type VideoPlaybackInstance = {
  readFrame: () => Frame | null
  restart: () => void
}

export type VideoPlayer = {
  readFrame: () => Frame | null
  restart: () => void
  selectVideo: (videoId: string) => void
  id: string
}

export type EGVideo = ReturnType<typeof egVideo>

export function egVideo(
  eg: EGInfo,
  mediaPath: string,
  {
    onMediaUpdate,
  }: {
    onMediaUpdate: (mediaDb: DBState) => void
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

  async function loadVideo(fileSha256: string): Promise<VideoPlaybackInstance> {
    const dbState = await readDb(mediaPath)
    const file = dbState.files.find((file) => file.fileSha256 === fileSha256)
    // console.log('will load video', file)

    const MAX_QUEUE_SIZE = 10

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

    let resume = () => {}
    let pause = () => {}
    function startReadback() {
      let totalBufferRead = 0
      const readbackInstance = playCount++
      console.log('hello startReadback', readbackInstance)

      streamPaused = false
      const readableStream = createReadStream(framesFilePath, {
        // encoding: null
      })
      resume = () => {
        readableStream.resume()
        streamPaused = false
      }
      pause = () => {
        readableStream.pause()
        streamPaused = true
      }
      readableStream.on('data', (chunk: Buffer) => {
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

      readableStream.on('end', () => {
        // console.log('end event', {
        //   readbackInstance,
        //   currentBuffer: currentBuffer.length,
        //   queue: bufferQueue.length,
        // })
        while (currentBuffer.length >= frameSize) {
          const bufferToProcess = currentBuffer.slice(0, frameSize)
          currentBuffer = currentBuffer.slice(frameSize)
          bufferQueue.push(new Uint8Array(bufferToProcess))
        }
        console.log('Video playback read restart', readbackInstance)
        startReadback()
      })

      readableStream.on('error', (error: Error) => {
        console.error('Video playback read error:', error)
      })
    }

    function restart() {
      pause()
      bufferQueue = []
      currentBuffer = Buffer.alloc(0)
      startReadback()
    }
    console.log('will startReadback')
    startReadback()
    // setInterval(() => {
    //   if (bufferQueue.length > 0) {
    //     const uint8ArrayChunk = bufferQueue.shift()
    //     if (uint8ArrayChunk) {
    //       sendFrame(uint8ArrayChunk)
    //     }
    //     if (streamPaused && bufferQueue.length < MAX_QUEUE_SIZE) {
    //       readableStream.resume()
    //       streamPaused = false
    //     }
    //   }
    // }, 1000 / playbackFPS)
    function readFrame(): Frame | null {
      if (bufferQueue.length > 0) {
        const frame = bufferQueue.shift()
        if (streamPaused && bufferQueue.length < MAX_QUEUE_SIZE) {
          resume()
        }
        return frame || null
      }
      return null
    }
    return {
      readFrame,
      restart,
    }
  }

  function createPlayer(id: string): VideoPlayer {
    let activeVideo: string | null = null
    let videoInstance: VideoPlaybackInstance | null = null
    function readFrame(): Frame | null {
      if (videoInstance) {
        const frame = videoInstance.readFrame()
        return frame
      }
      return null
    }
    async function selectVideo(videoId: string) {
      if (activeVideo !== videoId) {
        console.log('selecting video', videoId)
        activeVideo = videoId
        videoInstance = await loadVideo(videoId)
      }
    }
    function restart() {
      if (videoInstance) {
        videoInstance.restart()
      }
    }
    return { readFrame, selectVideo, restart, id }
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
    getPlayer,
    incrementTime,
  }
}
