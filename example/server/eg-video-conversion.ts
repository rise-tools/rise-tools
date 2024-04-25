import { createHash } from 'crypto'
import {
  createReadStream,
  createWriteStream,
  existsSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import { readdir, stat } from 'fs-extra'
import { basename, extname } from 'path'
import zlib from 'zlib'

import { egStageMap } from './eg'
import { DBFile, readDb, updateDb } from './eg-video'

const args = process.argv.slice(2)
const sourceDirPath = args[0]
const outputDir = args[1]

const { join } = require('path')
const { spawn } = require('child_process')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path
const { execFileSync } = require('child_process')

const Jimp = require('jimp')

const importerVersion = 2

// const videoFilePath = join(process.cwd(), 'videos', videoName)
// console.log({ videoFilePath, ffmpegPath, ffprobePath })

async function importFile(
  filePath: string,
  outputDir: string,
  prevDbFile?: DBFile
): Promise<DBFile> {
  const videoName = basename(filePath)
  const title = basename(filePath, extname(filePath))

  console.log('Importing file:', videoName)
  const fileSha256 = await calculateChecksum(filePath)
  const audioFileNameRelative = `${fileSha256}.mp3`
  const audioFilePath = join(outputDir, audioFileNameRelative)
  if (
    prevDbFile &&
    prevDbFile.fileSha256 === fileSha256 &&
    prevDbFile.importerVersion === importerVersion &&
    // existsSync(audioFilePath) &&
    existsSync(join(outputDir, prevDbFile.egFramesFile))
  ) {
    console.log('File already imported, output exists, checksum matches. skipping...')
    return prevDbFile
  }
  const fileInfo = await stat(filePath)
  console.log('File size:', fileInfo.size)
  let audioFile: string | null
  const egFramesFile = `${fileSha256}.eg.data`
  try {
    await extractAudioToMP3(filePath, audioFilePath)

    audioFile = audioFileNameRelative
  } catch (e) {
    console.error('Failed to extract audio for ' + filePath, e)
    audioFile = null
  }
  return new Promise<DBFile>((resolve, reject) => {
    const dimensionsProbeData = execFileSync(
      ffprobePath,
      [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=width,height',
        '-of',
        'csv=p=0:s=x',
        filePath,
      ],
      {}
    )
    const dimensions = dimensionsProbeData.toString().trim().split('x').map(Number)
    let width = dimensions[0]
    let height = dimensions[1]

    const durationProbeData = execFileSync(
      ffprobePath,
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        filePath,
      ],
      {}
    )
    const durationInSeconds = parseFloat(durationProbeData.toString().trim())
    console.log(`Video duration: ${durationInSeconds} seconds`)
    console.log(`Video dimensions: ${width}x${height}`)

    let squareFilePath = filePath
    if (width !== height) {
      const newDimension = Math.min(width, height)
      const cropX = (width - newDimension) / 2
      const cropY = (height - newDimension) / 2
      squareFilePath = join(outputDir, `${fileSha256}.square.mp4`)
      console.log('Video is not square, cropping now...')
      execFileSync(
        ffmpegPath,
        [
          '-i',
          filePath,
          '-vf',
          `crop=${newDimension}:${newDimension}:${cropX}:${cropY}`,
          '-y', // overwrite
          '-c:a', // copy audio
          'copy',
          squareFilePath,
        ],
        { stdio: ['ignore', 'ignore', 'ignore'] }
      )
      console.log('Cropped video to square:', squareFilePath)
      width = newDimension
      height = newDimension
    }

    function normalizeCoordinate(v: number): number {
      return Math.max(Math.min(Math.round(v * width), width), 0)
    }

    const egStagePixelMap: { x: number; y: number }[] = []
    egStageMap.forEach((pixel) => {
      egStagePixelMap.push({
        x: normalizeCoordinate(pixel.x),
        y: normalizeCoordinate(pixel.y),
      })
    })

    // // CREATE A TEST IMAGE FOR EG STAGE PIXELS
    // new Jimp(width, height, '#FFFFFF', (err, image) => {
    //   if (err) throw err
    //   egStagePixelMap.forEach((pixel, index) => {
    //     image.setPixelColor(
    //       Jimp.cssColorToHex('#000000'),
    //       // Jimp.rgbaToInt(r, g, b, a),
    //       pixel.x,
    //       pixel.y
    //     )
    //   })
    //   image.write('./test-output/eg.png', (err) => {
    //     if (err) throw err
    //     console.log('Image created and saved!')
    //   })
    // })

    const format = 'rawvideo'
    const pixelBytes = 3 // RGB
    const frameSize = width * height * pixelBytes

    let videoBuffer = Buffer.alloc(0) // Buffer to hold frame data

    console.log('Extracting video...')
    const outputDataFile = join(outputDir, egFramesFile)

    try {
      unlinkSync(outputDataFile)
      console.log('removed existing file ', outputDataFile)
    } catch (e) {
      // console.warn('Failed to delete existing file', outputDataFile)
    }

    writeFileSync(outputDataFile, Buffer.alloc(0))

    const ffmpeg = spawn(ffmpegPath, [
      '-i',
      squareFilePath,
      '-f',
      format,
      '-vf',
      `scale=${width}:${height}`,
      '-pix_fmt',
      'rgb24',
      '-',
    ])

    ffmpeg.stdout.on('data', (chunk: Buffer) => {
      videoBuffer = Buffer.concat([videoBuffer, chunk])

      while (videoBuffer.length >= frameSize) {
        const frame = videoBuffer.slice(0, frameSize)
        processFrame(frame)
        videoBuffer = videoBuffer.slice(frameSize)
      }
    })

    ffmpeg.stderr.on('data', (data) => {
      // console.error(`stderr: ${data}`)
    })
    const startTime = Date.now()

    const frameOutputBuffer = new Uint8Array(egStageMap.length * 3)

    const fsWriter = createWriteStream(outputDataFile, {
      encoding: 'binary',
    })

    // const compressionWriter = zlib.createBrotliCompress({
    //   params: {
    //     [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_GENERIC,
    //     [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
    //   },
    // })

    // compressionWriter.pipe(fsWriter)

    ffmpeg.on('close', (code) => {
      console.log(`ffmpeg process exited with code ${code}`)
      const endTime = Date.now()
      const duration = endTime - startTime
      const durationInSeconds = duration / 1000
      console.log('Done in ' + durationInSeconds + ' seconds')
      // compressionWriter.close()
      fsWriter.close()
      resolve({
        fileSha256,
        width,
        height,
        durationInSeconds,
        completeTime: endTime,
        videoName,
        filePath,
        egFramesFile,
        audioFile,
        title,
        importerVersion,
      })
    })

    // async function writeEGFrameToImage(frameBuffer: Uint8Array) {
    //   const image = await Jimp.create(width, height, '#000000')
    //   egStagePixelMap.forEach((pixel, index) => {
    //     const startByte = index * 3
    //     image.setPixelColor(
    //       Jimp.rgbaToInt(
    //         frameBuffer[startByte],
    //         frameBuffer[startByte + 1],
    //         frameBuffer[startByte + 2],
    //         255
    //       ),
    //       pixel.x,
    //       pixel.y
    //     )
    //   })
    //   await image.write('./test-output/eg-frame.png')
    // }

    // async function writeVideoFrameToImage(frameBuffer: Uint8Array) {
    //   const image = await Jimp.create(width, height, '#FFFFFF')
    //   for (let x = 0; x < width; x += 1) {
    //     for (let y = 0; y < height; y += 1) {
    //       const startByte = x * 3 + y * width * 3
    //       image.setPixelColor(
    //         Jimp.rgbaToInt(
    //           frameBuffer[startByte],
    //           frameBuffer[startByte + 1],
    //           frameBuffer[startByte + 2],
    //           255
    //         ),
    //         x,
    //         y
    //       )
    //     }
    //   }
    //   await image.write('./test-output/video-frame.png')
    // }

    function appendFile(data: Uint8Array) {
      const buffer = Buffer.from(data.buffer, data.byteOffset, data.byteLength)
      // compressionWriter.write(buffer)
      fsWriter.write(buffer)
    }

    function processFrame(frame: Buffer) {
      let pixelStart = 0
      let outputStart = 0
      egStagePixelMap.forEach((pixel, index) => {
        pixelStart = pixel.x * pixelBytes + pixel.y * width * pixelBytes
        outputStart = index * 3
        frameOutputBuffer[outputStart] = frame[pixelStart] // r
        frameOutputBuffer[outputStart + 1] = frame[pixelStart + 1] // g
        frameOutputBuffer[outputStart + 2] = frame[pixelStart + 2] //b
      })

      // writeVideoFrameToImage(frame).then(() => {
      //   console.log('wrote video frame')
      // })

      // writeEGFrameToImage(frameOutputBuffer)
      //   .then(() => {
      //     console.log('wrote image')
      //   })
      //   .catch((err) => {
      //     console.error('error writing image', err)
      //   })
      //   .finally(() => {})

      appendFile(frameOutputBuffer)
    }
  })
}

function calculateChecksum(filePath: string): Promise<string> {
  console.log('Calculating checksum...')
  return new Promise<string>((resolve, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(filePath)
    stream.on('data', (data) => {
      hash.update(data, 'utf8')
    })
    stream.on('end', () => {
      const checksum = hash.digest('hex')
      console.log('Checksum:', checksum)
      resolve(checksum)
    })
    stream.on('error', (err) => {
      reject(err)
    })
  })
}

async function readDirRecursive(scanDir: string) {
  let files: string[] = []
  const items = await readdir(scanDir, { withFileTypes: true })
  for (const item of items) {
    const fullPath = join(scanDir, item.name)
    if (item.isDirectory()) {
      files = files.concat(await readDirRecursive(fullPath))
    } else {
      files.push(fullPath)
    }
  }
  return files
}

function extractAudioToMP3(videoFilePath: string, audioOutputPath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    console.log('extracting audio from ' + videoFilePath + ' to ' + audioOutputPath)
    const args = [
      '-y',
      '-i',
      videoFilePath,
      '-vn',
      '-acodec',
      'libmp3lame',
      '-ab',
      '192k',
      audioOutputPath,
    ]
    const ffmpeg = spawn('ffmpeg', args)
    ffmpeg.stdout.on('data', (data) => {
      // console.log(`stdout: ${data}`)
    })
    ffmpeg.stderr.on('data', (data) => {
      // console.error(`stderr: ${data}`)
    })
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log('Audio extracted and converted to MP3 successfully')
        resolve()
      } else {
        console.error(`Audio extraction exited with code ${code}`)
        reject(new Error(`Audio extraction exited with code ${code}`))
      }
    })
    ffmpeg.on('error', (err) => {
      console.error('Audio extraction: failed to start FFmpeg process')
      reject(err)
    })
  })
}

async function main(scanPath: string, outputDir: string) {
  console.log({ sourceDirPath })
  const scan = await readDirRecursive(scanPath)
  const extensions = new Set()
  for (const filePath of scan) {
    extensions.add(extname(filePath).toLocaleLowerCase())
  }
  const videoFilePaths = scan.filter((filePath) => {
    const isDotFile = basename(filePath).startsWith('.')
    if (isDotFile) return false
    const ext = extname(filePath).toLocaleLowerCase()
    const isVideo = ext === '.mp4' || ext === '.mov'
    if (!isVideo) return false

    // const fileInfo = statSync(filePath)
    // // allow files of up to 500MB
    // return fileInfo.size < 500_000_000
    return true
  })
  const dbState = await readDb(outputDir)
  console.log({ scan, extensions, videoFilePaths })
  for (const videoFilePath of videoFilePaths) {
    console.log('starting import...', videoFilePath)
    const prevFile = dbState.files.find((file) => file.filePath === videoFilePath)

    const dbFile = await importFile(videoFilePath, outputDir, prevFile)
    console.log('Done with export', { dbFile })
    await updateDb(outputDir, (state) => {
      return {
        ...state,
        files: [...state.files.filter((f) => f.fileSha256 !== dbFile.fileSha256), dbFile],
      }
    })
  }
}

main(sourceDirPath, outputDir)
  .then(() => {
    console.log('complete.')
  })
  .catch((e) => {
    console.error('error:', e)
  })
