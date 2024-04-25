import { eg as egInfo } from './eg'
import { Frame } from './eg-sacn'
import {
  createSolidHSLFrame,
  createSolidRGBFrame,
  frameAdd,
  frameBrighten,
  frameColorize,
  frameDarken,
  frameDesaturate,
  frameHueShift,
  frameInvert,
  frameMask,
  frameMix,
  frameRotate,
} from './eg-tools'
import {
  BrightenEffect,
  ColorizeEffect,
  ColorMedia,
  DarkenEffect,
  DesaturateEffect,
  Effect,
  Effects,
  HueShiftEffect,
  InvertEffect,
  LayersMedia,
  MainState,
  Media,
  RotateEffect,
  SequenceItem,
  SequenceMedia,
  StateContext,
  VideoMedia,
} from './state-schema'

// const readyVideoPlayers: Record<string, undefined | VideoPlayer> = {}
// const loadingVideoPlayers: Record<string, undefined | Promise<void>> = {}

// function getVideoPlayback(video: EGVideo, fileId: string) {
//   if (readyVideoPlayers[fileId]) return readyVideoPlayers[fileId]
//   if (loadingVideoPlayers[fileId]) return null
//   loadingVideoPlayers[fileId] = video
//     .loadVideo(fileId)
//     .then((player) => {
//       readyVideoPlayers[fileId] = player
//     })
//     .catch((e) => {
//       console.error('Error loading video', e)
//     })
//     .finally(() => {
//       delete loadingVideoPlayers[fileId]
//     })
// }

// const egEffectAppliers: Record<
//   keyof typeof effectsSchema,
//   (frame: Uint8Array, progress: number, intensity: number, waveLength: number) => Uint8Array
// > = {
//   flash: flashEffect(egInfo),
//   waveIn: waveFrameLayerEffect(egInfo, true),
//   waveOut: waveFrameLayerEffect(egInfo, false),
// }

// const stagelinqLastBeatTime = 0
// const stagelinqLastMeasureTime = 0
// const stagelinqBpm = 0

// const effectDuration = 1000
// function applyEGEffects(mainState: MainState, ctx: StateContext, frame: Uint8Array): Uint8Array {
//   const outputFrame = frame
//   const { nowTime } = ctx
//   effectTypes.forEach((effectName) => {
//     const applier = egEffectAppliers[effectName]
//     const lastEffectTime = mainState.effects[effectName]
//     if (lastEffectTime !== null) {
//       const quickEffectAmount = Math.min(
//         1,
//         Math.max(0, (nowTime - lastEffectTime) / effectDuration)
//       )
//       if (quickEffectAmount > 0) {
//         outputFrame = applier(outputFrame, quickEffectAmount, 1, 0.5)
//       }
//     }
//   })
//   apply manual beat effect
//   if (mainState.manualBeat.enabled && false) {
//     const manualBeatEffectDuration = 60_000 / mainState.manualBeat.bpm
//     const applyEffect = egEffectAppliers[mainState.beatEffect.effect]
//     const beatsPassed = ~~((nowTime - mainState.manualBeat.lastBeatTime) / manualBeatEffectDuration)
//     const lastEffectTime =
//       mainState.manualBeat.lastBeatTime + beatsPassed * manualBeatEffectDuration
//     if (lastEffectTime !== null) {
//       const beatEffectProgress = Math.min(
//         1,
//         Math.max(0, (nowTime - lastEffectTime) / manualBeatEffectDuration)
//       )
//       if (beatEffectProgress > 0) {
//         outputFrame = applyEffect(
//           outputFrame,
//           beatEffectProgress,
//           (mainState.beatEffect.intensity / 100) *
//             (1 - mainState.beatEffect.dropoff * beatEffectProgress),
//           mainState.beatEffect.waveLength
//         )
//       }
//     }
//   }

//   if (stagelinqBpm && stagelinqLastMeasureTime && false) {
//     const beatEffectDuration = (60_000 / stagelinqBpm) * 4
//     const applyEffect = egEffectAppliers[mainState.beatEffect.effect]
//     const beatsPassed = ~~((nowTime - stagelinqLastMeasureTime) / beatEffectDuration)
//     const lastEffectTime = stagelinqLastMeasureTime + beatsPassed * beatEffectDuration
//     if (lastEffectTime !== null) {
//       const beatEffectProgress = Math.min(
//         1,
//         Math.max(0, (nowTime - lastEffectTime) / beatEffectDuration)
//       )
//       // console.log('beat effect progress', beatEffectProgress, stagelinqBpm, stagelinqLastBeatTime)
//       if (beatEffectProgress > 0) {
//         outputFrame = applyEffect(
//           outputFrame,
//           beatEffectProgress,
//           (mainState.beatEffect.intensity / 100) *
//             (1 - mainState.beatEffect.dropoff * beatEffectProgress),
//           mainState.beatEffect.waveLength
//         )
//       }
//     }
//   }
//   return outputFrame
// }

const blackFrame = createSolidRGBFrame(egInfo, 0, 0, 0)

function getSmoothingRatio(valuePath: string) {
  return 0.05
}

function applyGradientValue(destValue: number, valuePath: string, ctx: StateContext) {
  let nextValue = destValue
  const recentValue = ctx.recentGradientValues[valuePath]
  if (recentValue != null) {
    const smoothingRatio = getSmoothingRatio(valuePath)
    nextValue = destValue * smoothingRatio + recentValue * (1 - smoothingRatio)
  }
  ctx.recentGradientValues[valuePath] = nextValue
  return nextValue
}

function colorFrame(media: ColorMedia, ctx: StateContext, mediaPath: string): Frame {
  const h = applyGradientValue(media.h, `${mediaPath}.h`, ctx)
  const s = applyGradientValue(media.s, `${mediaPath}.s`, ctx)
  const l = applyGradientValue(media.l, `${mediaPath}.l`, ctx)
  return createSolidHSLFrame(egInfo, h, s, l)
}

function videoFrameBare(media: VideoMedia, ctx: StateContext): Frame {
  const video = ctx.video.getPlayer(media.id)
  if (media.params) video.setParams(media.params)
  if (media.track) {
    video.selectVideo(media.track)
    return video.readFrame() || blackFrame
  }
  return blackFrame
}

function withColorize(
  frame: Frame,
  effect: ColorizeEffect,
  ctx: StateContext,
  mediaPath: string
): Frame {
  const amount = applyGradientValue(effect.amount, `${mediaPath}.amount`, ctx)
  const hue = applyGradientValue(effect.hue, `${mediaPath}.hue`, ctx)
  const saturation = applyGradientValue(effect.saturation, `${mediaPath}.saturation`, ctx)
  return frameColorize(egInfo, frame, amount, hue, saturation)
}

function withDesaturate(
  frame: Frame,
  effect: DesaturateEffect,
  ctx: StateContext,
  mediaPath: string
): Frame {
  const value = applyGradientValue(effect.value, `${mediaPath}.value`, ctx)
  return frameDesaturate(egInfo, frame, value)
}

function withHueShift(
  frame: Frame,
  effect: HueShiftEffect,
  ctx: StateContext,
  mediaPath: string
): Frame {
  const value = applyGradientValue(effect.value, `${mediaPath}.value`, ctx)
  return frameHueShift(egInfo, frame, value)
}

function withRotate(
  frame: Frame,
  effect: RotateEffect,
  ctx: StateContext,
  mediaPath: string
): Frame {
  const value = applyGradientValue(effect.value, `${mediaPath}.value`, ctx)
  return frameRotate(egInfo, frame, value)
}

function withInvert(
  frame: Frame,
  effect: InvertEffect,
  ctx: StateContext,
  mediaPath: string
): Frame {
  return frameInvert(egInfo, frame)
}

function withBrighten(
  frame: Frame,
  effect: BrightenEffect,
  ctx: StateContext,
  mediaPath: string
): Frame {
  const value = applyGradientValue(effect.value, `${mediaPath}.value`, ctx)
  return frameBrighten(egInfo, frame, value)
}

function withDarken(
  frame: Frame,
  effect: DarkenEffect,
  ctx: StateContext,
  mediaPath: string
): Frame {
  const value = applyGradientValue(effect.value, `${mediaPath}.value`, ctx)
  return frameDarken(egInfo, frame, value)
}

function withMediaEffect(
  frame: Frame,
  effect: Effect,
  ctx: StateContext,
  mediaPath: string
): Frame {
  if (effect.type === 'colorize') return withColorize(frame, effect, ctx, mediaPath)
  if (effect.type === 'desaturate') return withDesaturate(frame, effect, ctx, mediaPath)
  if (effect.type === 'hueShift') return withHueShift(frame, effect, ctx, mediaPath)
  if (effect.type === 'invert') return withInvert(frame, effect, ctx, mediaPath)
  if (effect.type === 'brighten') return withBrighten(frame, effect, ctx, mediaPath)
  if (effect.type === 'darken') return withDarken(frame, effect, ctx, mediaPath)
  if (effect.type === 'rotate') return withRotate(frame, effect, ctx, mediaPath)
  return frame
}

function withMediaEffects(
  frame: Frame,
  effects: Effects | undefined,
  ctx: StateContext,
  mediaPath: string
): Frame {
  let outFrame = frame
  effects?.forEach((effect) => {
    outFrame = withMediaEffect(outFrame, effect, ctx, `${mediaPath}.${effect.key}`)
  })
  return outFrame
}

function videoFrame(media: VideoMedia, ctx: StateContext, mediaPath: string): Frame {
  const frame = videoFrameBare(media, ctx)
  return withMediaEffects(frame, media.effects, ctx, `${mediaPath}.effects`)
}

function layerBlend(
  frameA: Frame,
  frameB: Frame,
  blendMode: 'mix' | 'add' | 'mask',
  blendAmount: number
): Frame {
  if (blendMode === 'mix') return frameMix(egInfo, frameA, frameB, blendAmount)
  if (blendMode === 'add') return frameAdd(egInfo, frameA, frameB, blendAmount)
  if (blendMode === 'mask') return frameMask(egInfo, frameA, frameB, blendAmount)
  return frameA
}

function layersFrame(media: LayersMedia, ctx: StateContext, mediaPath: string): Frame {
  const reverseLayers = media.layers.slice(0, -1).reverse()
  const firstLayer = media.layers.at(-1)
  if (!firstLayer) return blackFrame
  let frame = mediaFrame(firstLayer.media, ctx, `${mediaPath}.layer.${firstLayer.key}`)
  reverseLayers.forEach((layer) => {
    const layerAmount = applyGradientValue(
      layer.blendAmount,
      `${mediaPath}.layerBlendAmount.${layer.key}`,
      ctx
    )
    frame = layerBlend(
      frame,
      mediaFrame(layer.media, ctx, `${mediaPath}.layer.${layer.key}`),
      layer.blendMode,
      layerAmount
    )
  })
  return frame
}

export function getSequenceActiveItem(media: SequenceMedia): SequenceItem | undefined {
  const { sequence, activeKey } = media
  return sequence.find((media) => media.key === activeKey) || media.sequence[0]
}

function sequenceFrame(media: SequenceMedia, ctx: StateContext, mediaPath: string): Frame {
  const activeMedia = getSequenceActiveItem(media)
  if (!activeMedia) return blackFrame
  return mediaFrame(activeMedia.media, ctx, `${mediaPath}.item.${activeMedia.key}`)
}

function mediaFrame(media: Media, ctx: StateContext, mediaPath: string): Frame {
  if (media.type === 'color') return colorFrame(media, ctx, mediaPath)
  if (media.type === 'video') return videoFrame(media, ctx, mediaPath)
  if (media.type === 'layers') return layersFrame(media, ctx, mediaPath)
  if (media.type === 'sequence') return sequenceFrame(media, ctx, mediaPath)
  if (media.type === 'off') return blackFrame
  return blackFrame
}

export function getEGLiveFrame(mainState: MainState, ctx: StateContext, readyFrame: Frame): Frame {
  const liveFrame = mediaFrame(mainState.liveMedia, ctx, 'liveMedia')
  let transitionProgresss =
    mainState.transitionState.manual == null
      ? null
      : applyGradientValue(mainState.transitionState.manual, 'transitionState.manual', ctx)

  if (mainState.transitionState.autoStartTime && !transitionProgresss) {
    transitionProgresss = Math.min(
      1,
      (ctx.nowTime - mainState.transitionState.autoStartTime) / mainState.transition.duration
    )
  }
  const finalFrame = frameMix(egInfo, liveFrame, readyFrame, transitionProgresss || 0)
  return finalFrame
}

export function getEGReadyFrame(mainState: MainState, ctx: StateContext): Frame {
  return mediaFrame(mainState.readyMedia, ctx, 'readyMedia')
}
