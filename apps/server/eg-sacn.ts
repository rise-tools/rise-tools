import { createReadStream } from 'fs'
import WebSocket from 'ws'
import chroma from 'chroma-js'
import { EGInfo } from './eg'
const { Sender, Receiver } = require('sacn')

export type Frame = Uint8Array

export function egSacnService(eg: EGInfo, previewWebSocketPort?: number) {
  const stripCount = eg.egStageRadials
  const pixelsPerStrip = eg.egStageStripLength
  const sacnEveryOtherStrip = true
  const pixelsPerUniverse = Math.floor(512 / 3)
  const universeMultiplier = sacnEveryOtherStrip ? 2 : 1
  const { frameSize } = eg

  const universes = new Map<number, typeof Sender>()

  // const Receiver = require('sacn').Receiver
  // const receiveUniverses: number[] = []
  // for (let i = 0; i < stripCount; i++) {
  //   const startUniverse = i * universeMultiplier * 3 + 1
  //   receiveUniverses.push(startUniverse)
  //   receiveUniverses.push(startUniverse + 1)
  //   receiveUniverses.push(startUniverse + 2)
  // }
  // const receiver = new Receiver({ universes: receiveUniverses, reuseAddr: true })

  // type SACNReceivePacket = {
  //   // "sourceName": "Onyx", // controller that sent the packet
  //   sourceName: string
  //   // "sourceAddress": "192.168.1.69", // ip address of the controller
  //   sourceAddress: string
  //   // "universe": 1, // DMX universe
  //   universe: number
  //   // "sequence": 172, // packets are numbered 0-255 to keep them in order
  //   sequence: number
  //   // "priority": 100, // 0-200. used if multiple controllers send to the same universe
  //   priority: number
  //   // "payload": { // an object with the percentage values of DMX channels 1-512
  //   //   1: 100,
  //   payload: Record<string, number>
  // }
  // function blankFrame() {
  //   const frame = new Uint8Array(3 * pixelsPerStrip * stripCount)
  //   return frame
  // }
  // let lastFrame = blankFrame()
  // let lastSequenceNumber = 0
  // let lastPacketsRemaining = 0
  // let currentFrame = blankFrame()
  // let currentSequenceNumber = 0
  // let currentPacketsRemaining = stripCount * 3
  // let flushedFrame = blankFrame()
  // function acceptPacket(packet: SACNReceivePacket, frame: Uint8Array) {
  //   const universe = packet.universe
  //   const stripIndex = Math.floor((universe - 1) / (3 * universeMultiplier))
  //   const offsetUniverse = universe - (stripIndex * universeMultiplier * 3 + 1)
  //   const pixelsInThisUniverse =
  //     offsetUniverse === 2 ? pixelsPerStrip % pixelsPerUniverse : pixelsPerUniverse
  //   for (let i = 0; i < pixelsInThisUniverse; i++) {
  //     const startByte = (stripIndex * pixelsPerStrip + i + offsetUniverse * pixelsPerUniverse) * 3
  //     frame[startByte] = packet.payload[String(i * 3 + 1)]
  //     frame[startByte + 1] = packet.payload[String(i * 3 + 2)]
  //     frame[startByte + 2] = packet.payload[String(i * 3 + 3)]
  //   }
  // }
  // receiver.on('packet', (packet: SACNReceivePacket) => {
  //   // console.log('sacn packet', packet.universe)

  //   if (packet.sequence === lastSequenceNumber) {
  //     acceptPacket(packet, lastFrame)
  //     lastPacketsRemaining -= 1
  //     if (lastPacketsRemaining === 0) {
  //       flushedFrame = lastFrame
  //       setTimeout(flushFrame, 1)
  //     }
  //   }

  //   if (packet.sequence !== currentSequenceNumber) {
  //     // move to next sequence number
  //     if (lastPacketsRemaining !== 0) {
  //       console.log(
  //         'skipping unfinished frame with unused packets:',
  //         stripCount * 3 - lastPacketsRemaining
  //       )
  //     }
  //     lastFrame = currentFrame
  //     lastSequenceNumber = currentSequenceNumber
  //     lastPacketsRemaining = currentPacketsRemaining
  //     currentFrame = blankFrame()
  //     currentSequenceNumber = packet.sequence
  //     currentPacketsRemaining = stripCount * 3
  //   }
  //   acceptPacket(packet, currentFrame)
  //   currentPacketsRemaining -= 1
  //   if (currentPacketsRemaining === 0) {
  //     setTimeout(flushFrame, 1)
  //     flushedFrame = currentFrame
  //   }
  // })
  // function flushFrame() {
  //   sendPreviewImageFrame(flushedFrame)
  // }

  const clientSenders = new Map<string, (value: Uint8Array) => void>()
  if (previewWebSocketPort) {
    const wss = new WebSocket.Server({ port: previewWebSocketPort })
    let clientIdIndex = 0

    wss.on('listening', () => {
      console.log(`preview service listening on port ${previewWebSocketPort}`)
    })
    wss.on('connection', function connection(ws) {
      const clientId = `c${clientIdIndex}`
      clientIdIndex += 1
      console.log(`Image Client ${clientId} connected`)

      function sendClient(value: Uint8Array) {
        ws.send(value)
      }

      clientSenders.set(clientId, sendClient)

      ws.on('close', function close() {
        clientSenders.delete(clientId)
        console.log(`Image Client ${clientId} disconnected`)
      })
    })
  }
  function sendPreviewImageFrame(frame: Uint8Array) {
    clientSenders.forEach((sender) => {
      sender(frame)
    })
  }

  function createSolidRGBFrame(redByte: number, greenByte: number, blueByte: number) {
    const frame = new Uint8Array(3 * pixelsPerStrip * stripCount)
    for (let stripIndex = 0; stripIndex < stripCount; stripIndex += 1) {
      for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex += 1) {
        const startByte = (stripIndex * pixelsPerStrip + pixelIndex) * 3
        frame[startByte] = redByte
        frame[startByte + 1] = greenByte
        frame[startByte + 2] = blueByte
      }
    }
    return frame
  }

  function createSolidHSLFrame(hue: number, saturation: number, lightness: number) {
    const color = chroma.hsl(hue, saturation, lightness)
    return createSolidRGBFrame(color.get('rgb.r'), color.get('rgb.g'), color.get('rgb.b'))
  }

  function createRepeatedStripFrame(stripValues: Uint8Array) {
    const frame = new Uint8Array(3 * pixelsPerStrip * stripCount)
    for (let stripIndex = 0; stripIndex < stripCount; stripIndex += 1) {
      for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex += 1) {
        const startByte = (stripIndex * pixelsPerStrip + pixelIndex) * 3
        frame[startByte] = stripValues[pixelIndex * 3]
        frame[startByte + 1] = stripValues[pixelIndex * 3 + 1]
        frame[startByte + 2] = stripValues[pixelIndex * 3 + 2]
      }
    }
    return frame
  }

  function createRainbowFrame(progress: number) {
    // input progress is a ratio from 0-1
    const stripFrame = new Uint8Array(3 * pixelsPerStrip)
    // for each pixel in the strip, use a different hue. the first pixel hue is basically progress*360
    for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex += 1) {
      const hue = (progress + pixelIndex / pixelsPerStrip) % 1
      const color = chroma.hsl(hue * 360, 1, 0.5)
      stripFrame[pixelIndex * 3] = color.get('rgb.r')
      stripFrame[pixelIndex * 3 + 1] = color.get('rgb.g')
      stripFrame[pixelIndex * 3 + 2] = color.get('rgb.b')
    }
    return createRepeatedStripFrame(stripFrame)
  }

  for (let i = 0; i < stripCount; i++) {
    const startUniverse = i * universeMultiplier * 3 + 1
    universes.set(startUniverse, new Sender({ universe: startUniverse, reuseAddr: true }))
    universes.set(startUniverse + 1, new Sender({ universe: startUniverse + 1, reuseAddr: true }))
    universes.set(startUniverse + 2, new Sender({ universe: startUniverse + 2, reuseAddr: true }))
  }

  // const redFrame = new Uint8Array(3 * pixelsPerStrip * stripCount)
  // for (let stripIndex = 0; stripIndex < stripCount; stripIndex += 1) {
  //   for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex += 1) {
  //     const startByte = (stripIndex * pixelsPerStrip + pixelIndex) * 3
  //     redFrame[startByte] = 255
  //   }
  // }

  // const greenFrame = new Uint8Array(3 * pixelsPerStrip * stripCount)
  // for (let stripIndex = 0; stripIndex < stripCount; stripIndex += 1) {
  //   for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex += 1) {
  //     const startByte = (stripIndex * pixelsPerStrip + pixelIndex) * 3
  //     greenFrame[startByte + 1] = 255
  //   }
  // }

  // const blueFrame = new Uint8Array(3 * pixelsPerStrip * stripCount)
  // for (let stripIndex = 0; stripIndex < stripCount; stripIndex += 1) {
  //   for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex += 1) {
  //     const startByte = (stripIndex * pixelsPerStrip + pixelIndex) * 3
  //     blueFrame[startByte + 2] = 255
  //   }
  // }

  if (process.env.DISABLE_SACN) console.log('SACN OUTPUT DISABLED with DISABLE_SACN env')

  async function sendFrame(frame: Uint8Array) {
    sendPreviewImageFrame(frame)
    if (process.env.DISABLE_SACN) return
    const payloads = new Map<
      number, // universe
      Record<
        string, //channel
        number //value
      >
    >()
    for (let stripIndex = 0; stripIndex < stripCount; stripIndex++) {
      // console.log('sending', stripIndex + 1)
      const startUniverse = stripIndex * universeMultiplier * 3 + 1
      const payloadUniverses: [
        Record<string, number>,
        Record<string, number>,
        Record<string, number>
      ] = [{}, {}, {}]
      for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex++) {
        const startByte = (stripIndex * pixelsPerStrip + pixelIndex) * 3
        const red = frame[startByte]
        const green = frame[startByte + 1]
        const blue = frame[startByte + 2]
        const startUniverse = ~~((pixelIndex * 3) / 509)
        const universePayload = payloadUniverses[startUniverse]
        const startChannel = (pixelIndex % pixelsPerUniverse) * 3 + 1
        universePayload[String(startChannel)] = red
        universePayload[String(startChannel + 1)] = green
        universePayload[String(startChannel + 2)] = blue
      }
      payloads.set(startUniverse, payloadUniverses[0])
      payloads.set(startUniverse + 1, payloadUniverses[1])
      payloads.set(startUniverse + 2, payloadUniverses[2])
    }
    const promises: Promise<void>[] = []
    payloads.forEach((payload, universe) => {
      const sender = universes.get(universe)
      promises.push(sender.send({ payload, priority: 102 }))
    })
    await Promise.all(promises)
  }

  function applyEGFlash(
    frame: Uint8Array,
    progress: number, // goes from 0-1
    intensity: number // goes from 0-1
  ): Uint8Array {
    const effectByteHeight = Math.round((1 - progress) * intensity * 255)
    const outputFrame = new Uint8Array(frameSize)
    for (let i = 0; i < frameSize; i++) {
      outputFrame[i] = Math.min(255, frame[i] + effectByteHeight)
    }
    return outputFrame
  }

  function simpleWave(progress: number) {
    // output a wave from 0-1 as input goes from 0-1
    const usableProgress = Math.min(1, Math.max(0, progress))
    return 1 - (0.5 + Math.cos(Math.PI * 2 * usableProgress) / 2)
  }

  // function applyEGWaveIn(
  //   frame: Uint8Array,
  //   progressDown: number // 1 is effect start, 0 effect over
  // ): Uint8Array {
  //   // const waveLength = 0.5 // ratio: size of wave relative to whole strip length
  //   const waveLength = 0.3 // ratio: size of wave relative to whole strip length
  //   const waveTravel = 1 + waveLength * 2
  //   const progressUp = 1 - progressDown
  //   const outputFrame = new Uint8Array(frameSize)
  //   const effectStrip = new Uint8Array(pixelsPerStrip * 3)
  //   for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex++) {
  //     const pixelPosition = pixelIndex / pixelsPerStrip
  //     const waveProgress = ((progressUp * waveTravel - pixelPosition) * (1 / waveLength)) / 1
  //     const waveValue = Math.round(simpleWave(waveProgress) * 255)
  //     effectStrip[pixelIndex * 3 + 0] = waveValue
  //     effectStrip[pixelIndex * 3 + 1] = waveValue
  //     effectStrip[pixelIndex * 3 + 2] = waveValue
  //   }
  //   let frameI = 0
  //   for (let stripIndex = 0; stripIndex < stripCount; stripIndex++) {
  //     for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex++) {
  //       const startI = frameI
  //       outputFrame[startI + 0] = Math.min(255, frame[startI + 0] + effectStrip[pixelIndex * 3 + 0])
  //       outputFrame[startI + 1] = Math.min(255, frame[startI + 1] + effectStrip[pixelIndex * 3 + 0])
  //       outputFrame[startI + 2] = Math.min(255, frame[startI + 2] + effectStrip[pixelIndex * 3 + 0])
  //       frameI += 3
  //     }
  //   }
  //   return outputFrame
  // }

  // //   basic test of FPS, sending RGB frames 1 second apart
  // let sendFramePromise = Promise.resolve()
  // let lastColorFrame = null
  // let frameCount = 0
  // const startTime = Date.now()
  // function scheduleFrame() {
  //   const rot = Math.floor(Date.now() / 1000) % 3
  //   const colorFrame = rot === 0 ? redFrame : rot === 1 ? greenFrame : blueFrame
  //   if (colorFrame !== lastColorFrame) {
  //     console.log(rot === 0 ? 'red' : rot === 1 ? 'green' : 'blue')
  //     const durationMs = Date.now() - startTime
  //     console.log('fps: ', frameCount / (durationMs / 1000))
  //   }
  //   frameCount += 1
  //   lastColorFrame = colorFrame
  //   sendFramePromise = sendFrame(colorFrame).then(scheduleFrame)
  // }
  // scheduleFrame()

  function frameAddStrip(frame: Uint8Array, strip: Uint8Array) {
    const outputFrame = new Uint8Array(frameSize)
    let frameI = 0
    for (let stripIndex = 0; stripIndex < stripCount; stripIndex++) {
      for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex++) {
        const startI = frameI
        outputFrame[startI + 0] = Math.min(255, frame[startI + 0] + strip[pixelIndex * 3 + 0])
        outputFrame[startI + 1] = Math.min(255, frame[startI + 1] + strip[pixelIndex * 3 + 0])
        outputFrame[startI + 2] = Math.min(255, frame[startI + 2] + strip[pixelIndex * 3 + 0])
        frameI += 3
      }
    }
    return outputFrame
  }

  function waveFrameLayerEffect(invertDirection: boolean) {
    return (frame: Uint8Array, progress: number, intensity: number, waveLength: number) => {
      const waveTravel = 1 + waveLength * 2
      const progressUp = invertDirection ? 1 - progress : progress
      const effectStrip = new Uint8Array(pixelsPerStrip * 3)
      for (let pixelIndex = 0; pixelIndex < pixelsPerStrip; pixelIndex++) {
        const pixelPosition = pixelIndex / pixelsPerStrip
        const waveProgress = ((progressUp * waveTravel - pixelPosition) * (1 / waveLength)) / 1
        const waveValue = simpleWave(waveProgress) * intensity * 255
        effectStrip[pixelIndex * 3 + 0] = Math.round(waveValue)
        effectStrip[pixelIndex * 3 + 1] = Math.round(waveValue)
        effectStrip[pixelIndex * 3 + 2] = Math.round(waveValue)
      }
      return frameAddStrip(frame, effectStrip)
    }
  }

  function frameAdd(frame1: Frame, frame2: Frame) {
    const outputFrame = new Uint8Array(frameSize)
    for (let i = 0; i < frameSize; i++) {
      outputFrame[i] = Math.min(255, frame1[i] + frame2[i])
    }
    return outputFrame
  }

  return {
    eg,
    close: () => {},
    sendFrame,
    frameAddStrip,
    frameAdd,
    createSolidRGBFrame,
    createSolidHSLFrame,
    createRainbowFrame,
    createRepeatedStripFrame,
    applyEGFlash,
    // applyEGWaveIn,
    waveFrameLayerEffect,
  }
}
