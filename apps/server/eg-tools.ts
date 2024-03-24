import chroma from 'chroma-js'
import { EGInfo } from './eg'
import { Frame } from './eg-sacn'

export function applyEGFlash(
  info: EGInfo,
  frame: Uint8Array,
  progress: number, // goes from 0-1
  intensity: number // goes from 0-1
): Uint8Array {
  const { frameSize } = info
  const effectByteHeight = Math.round((1 - progress) * intensity * 255)
  const outputFrame = new Uint8Array(frameSize)
  for (let i = 0; i < frameSize; i++) {
    outputFrame[i] = Math.min(255, frame[i] + effectByteHeight)
  }
  return outputFrame
}

export function flashEffect(info: EGInfo) {
  return (frame: Uint8Array, progress: number, intensity: number) =>
    applyEGFlash(info, frame, progress, intensity)
}

export function frameAddStrip(info: EGInfo, frame: Uint8Array, strip: Uint8Array) {
  const { frameSize, egStageRadials, egStageStripLength } = info
  const outputFrame = new Uint8Array(frameSize)
  let frameI = 0
  for (let stripIndex = 0; stripIndex < egStageRadials; stripIndex++) {
    for (let pixelIndex = 0; pixelIndex < egStageStripLength; pixelIndex++) {
      const startI = frameI
      outputFrame[startI + 0] = Math.min(255, frame[startI + 0] + strip[pixelIndex * 3 + 0])
      outputFrame[startI + 1] = Math.min(255, frame[startI + 1] + strip[pixelIndex * 3 + 0])
      outputFrame[startI + 2] = Math.min(255, frame[startI + 2] + strip[pixelIndex * 3 + 0])
      frameI += 3
    }
  }
  return outputFrame
}

export function waveFrameLayerEffect(info: EGInfo, invertDirection: boolean) {
  const { egStageStripLength } = info
  return (frame: Uint8Array, progress: number, intensity: number, waveLength: number) => {
    const waveTravel = 1 + waveLength * 2
    const progressUp = invertDirection ? 1 - progress : progress
    const effectStrip = new Uint8Array(egStageStripLength * 3)
    for (let pixelIndex = 0; pixelIndex < egStageStripLength; pixelIndex++) {
      const pixelPosition = pixelIndex / egStageStripLength
      const waveProgress = ((progressUp * waveTravel - pixelPosition) * (1 / waveLength)) / 1
      const waveValue = simpleWave(waveProgress) * intensity * 255
      effectStrip[pixelIndex * 3 + 0] = Math.round(waveValue)
      effectStrip[pixelIndex * 3 + 1] = Math.round(waveValue)
      effectStrip[pixelIndex * 3 + 2] = Math.round(waveValue)
    }
    return frameAddStrip(info, frame, effectStrip)
  }
}

export function frameAdd(info: EGInfo, frame1: Frame, frame2: Frame) {
  const { frameSize } = info
  const outputFrame = new Uint8Array(frameSize)
  for (let i = 0; i < frameSize; i++) {
    outputFrame[i] = Math.min(255, frame1[i] + frame2[i])
  }
  return outputFrame
}

export function frameTransitionMix(
  info: EGInfo,
  frame1: Frame,
  frame2: Frame,
  progress: number // goes from 0-1
) {
  const { frameSize } = info
  const outputFrame = new Uint8Array(frameSize)
  for (let i = 0; i < frameSize; i++) {
    outputFrame[i] = Math.round(frame1[i] * (1 - progress) + frame2[i] * progress)
  }
  return outputFrame
}

export function frameInvert(info: EGInfo, frame: Frame) {
  const { frameSize } = info
  const outputFrame = new Uint8Array(frameSize)
  for (let i = 0; i < frameSize; i++) {
    outputFrame[i] = 255 - frame[i]
  }
  return outputFrame
}

export function frameDesaturate(info: EGInfo, frame: Frame, amount: number) {
  const { frameSize } = info
  const outputFrame = new Uint8Array(frameSize)
  for (let i = 0; i < frameSize; i += 3) {
    const color = chroma(frame[i], frame[i + 1], frame[i + 2])
    const desaturatedColor = color.desaturate(amount)
    outputFrame[i] = desaturatedColor.get('rgb.r')
    outputFrame[i + 1] = desaturatedColor.get('rgb.g')
    outputFrame[i + 2] = desaturatedColor.get('rgb.b')
  }
  return outputFrame
}

export function frameHueShift(info: EGInfo, frame: Frame, amount: number) {
  const { frameSize } = info
  const outputFrame = new Uint8Array(frameSize)
  for (let i = 0; i < frameSize; i += 3) {
    const baseColor = chroma(frame[i], frame[i + 1], frame[i + 2])
    const desaturatedColor = chroma.hsl(
      baseColor.get('hsl.h') + amount,
      baseColor.get('hsl.s'),
      baseColor.get('hsl.l')
    )
    outputFrame[i] = desaturatedColor.get('rgb.r')
    outputFrame[i + 1] = desaturatedColor.get('rgb.g')
    outputFrame[i + 2] = desaturatedColor.get('rgb.b')
  }
  return outputFrame
}

export function frameBrighten(info: EGInfo, frame: Frame, amount: number) {
  const { frameSize } = info
  const outputFrame = new Uint8Array(frameSize)
  for (let i = 0; i < frameSize; i++) {
    outputFrame[i] = Math.round(Math.min(255, frame[i] + amount * 255))
  }
  return outputFrame
}

export function frameDarken(info: EGInfo, frame: Frame, amount: number) {
  const { frameSize } = info
  const outputFrame = new Uint8Array(frameSize)
  for (let i = 0; i < frameSize; i++) {
    outputFrame[i] = Math.round(Math.max(0, frame[i] - amount * 255))
  }
  return outputFrame
}

function simpleWave(progress: number) {
  // output a wave from 0-1 as input goes from 0-1
  const usableProgress = Math.min(1, Math.max(0, progress))
  return 1 - (0.5 + Math.cos(Math.PI * 2 * usableProgress) / 2)
}

export function createSolidHSLFrame(
  info: EGInfo,
  hue: number,
  saturation: number,
  lightness: number
) {
  const color = chroma.hsl(hue, saturation, lightness)
  return createSolidRGBFrame(info, color.get('rgb.r'), color.get('rgb.g'), color.get('rgb.b'))
}
export function createSolidRGBFrame(
  info: EGInfo,
  redByte: number,
  greenByte: number,
  blueByte: number
) {
  const { frameSize, egStageRadials, egStageStripLength } = info
  const frame = new Uint8Array(3 * egStageStripLength * egStageRadials)
  for (let stripIndex = 0; stripIndex < egStageRadials; stripIndex += 1) {
    for (let pixelIndex = 0; pixelIndex < egStageStripLength; pixelIndex += 1) {
      const startByte = (stripIndex * egStageStripLength + pixelIndex) * 3
      frame[startByte] = redByte
      frame[startByte + 1] = greenByte
      frame[startByte + 2] = blueByte
    }
  }
  return frame
}

export function createRepeatedStripFrame(info: EGInfo, stripValues: Uint8Array) {
  const { egStageStripLength, egStageRadials } = info
  const frame = new Uint8Array(3 * egStageStripLength * egStageRadials)
  for (let stripIndex = 0; stripIndex < egStageRadials; stripIndex += 1) {
    for (let pixelIndex = 0; pixelIndex < egStageStripLength; pixelIndex += 1) {
      const startByte = (stripIndex * egStageStripLength + pixelIndex) * 3
      frame[startByte] = stripValues[pixelIndex * 3]
      frame[startByte + 1] = stripValues[pixelIndex * 3 + 1]
      frame[startByte + 2] = stripValues[pixelIndex * 3 + 2]
    }
  }
  return frame
}

export function createRainbowFrame(info: EGInfo, progress: number) {
  const { egStageStripLength } = info
  // input progress is a ratio from 0-1
  const stripFrame = new Uint8Array(3 * egStageStripLength)
  // for each pixel in the strip, use a different hue. the first pixel hue is basically progress*360
  for (let pixelIndex = 0; pixelIndex < egStageStripLength; pixelIndex += 1) {
    const hue = (progress + pixelIndex / egStageStripLength) % 1
    const color = chroma.hsl(hue * 360, 1, 0.5)
    stripFrame[pixelIndex * 3] = color.get('rgb.r')
    stripFrame[pixelIndex * 3 + 1] = color.get('rgb.g')
    stripFrame[pixelIndex * 3 + 2] = color.get('rgb.b')
  }
  return createRepeatedStripFrame(info, stripFrame)
}
