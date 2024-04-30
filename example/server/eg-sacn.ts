import { EGInfo, eg as egConsts } from './eg'
const { Sender, Receiver } = require('sacn')

export type Frame = Uint8Array

export function egSacnService(egInfo: EGInfo) {
  const { egStageRadials, egStageStripLength } = egInfo
  const sacnEveryOtherStrip = true
  const pixelsPerUniverse = Math.floor(512 / 3)
  const universeMultiplier = sacnEveryOtherStrip ? 2 : 1

  const universes = new Map<number, typeof Sender>()

  // const Receiver = require('sacn').Receiver
  // const receiveUniverses: number[] = []
  // for (let i = 0; i < egStageRadials; i++) {
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
  //   const frame = new Uint8Array(3 * egStageStripLength * egStageRadials)
  //   return frame
  // }
  // let lastFrame = blankFrame()
  // let lastSequenceNumber = 0
  // let lastPacketsRemaining = 0
  // let currentFrame = blankFrame()
  // let currentSequenceNumber = 0
  // let currentPacketsRemaining = egStageRadials * 3
  // let flushedFrame = blankFrame()
  // function acceptPacket(packet: SACNReceivePacket, frame: Uint8Array) {
  //   const universe = packet.universe
  //   const stripIndex = Math.floor((universe - 1) / (3 * universeMultiplier))
  //   const offsetUniverse = universe - (stripIndex * universeMultiplier * 3 + 1)
  //   const pixelsInThisUniverse =
  //     offsetUniverse === 2 ? egStageStripLength % pixelsPerUniverse : pixelsPerUniverse
  //   for (let i = 0; i < pixelsInThisUniverse; i++) {
  //     const startByte = (stripIndex * egStageStripLength + i + offsetUniverse * pixelsPerUniverse) * 3
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
  //         egStageRadials * 3 - lastPacketsRemaining
  //       )
  //     }
  //     lastFrame = currentFrame
  //     lastSequenceNumber = currentSequenceNumber
  //     lastPacketsRemaining = currentPacketsRemaining
  //     currentFrame = blankFrame()
  //     currentSequenceNumber = packet.sequence
  //     currentPacketsRemaining = egStageRadials * 3
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

  for (let i = 0; i < egStageRadials; i++) {
    const startUniverse = i * universeMultiplier * 3 + 1
    universes.set(startUniverse, new Sender({ universe: startUniverse, reuseAddr: true }))
    universes.set(startUniverse + 1, new Sender({ universe: startUniverse + 1, reuseAddr: true }))
    universes.set(startUniverse + 2, new Sender({ universe: startUniverse + 2, reuseAddr: true }))
  }

  if (process.env.DISABLE_SACN) console.log('SACN OUTPUT DISABLED with DISABLE_SACN env')

  async function sendFrame(frame: Uint8Array) {
    if (process.env.DISABLE_SACN) return
    const payloads = new Map<
      number, // universe
      Record<
        string, //channel
        number //value
      >
    >()
    for (let stripIndex = 0; stripIndex < egStageRadials; stripIndex++) {
      // console.log('sending', stripIndex + 1)
      const startUniverse = stripIndex * universeMultiplier * 3 + 1
      const payloadUniverses: [
        Record<string, number>,
        Record<string, number>,
        Record<string, number>
      ] = [{}, {}, {}]

      // Change thease magic numberz
      const stripIndexRotated = alignGate(stripIndex, 24, true);

      for (let pixelIndex = 0; pixelIndex < egStageStripLength; pixelIndex++) {
        const sourceIndex = insideOut(pixelIndex)
        const startByte = (stripIndexRotated * egStageStripLength + sourceIndex) * 3
        const red = frame[startByte]!
        const green = frame[startByte + 1]!
        const blue = frame[startByte + 2]!
        const startUniverse = ~~((pixelIndex * 3) / 509)
        const universePayload = payloadUniverses[startUniverse]!
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

  return {
    egInfo,
    close: () => { },
    sendFrame,
  }
}

/**
 * Reverses each pixels' position in the strips.
 * 
 * For each radial strip,
 * - The first pixel becomes the last
 * - The last pixel becomes the first
 * - The middle pixels stay in the same place
 * @param pixelIndex index of pixel in entire structure
 * @returns new index of pixel in structure
 */
function insideOut(pixelIndex: number): number {
  const radius = pixelIndex % egConsts.egStageStripLength
  const newRadius = egConsts.egStageStripLength - radius
  return pixelIndex - radius + newRadius
}

function alignGate(stripIndex: number, rotation: number, mirror = false): number {
  if (mirror) {
    stripIndex = egConsts.egStageRadials - stripIndex
  }
  stripIndex += rotation
  while (stripIndex < 0) stripIndex += egConsts.egStageRadials
  return stripIndex % egConsts.egStageRadials
}

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
