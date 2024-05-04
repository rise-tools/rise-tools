import {
  DefaultBounceAmount,
  DefaultBounceDuration,
  DefaultSmoothing,
  DefaultTransitionDuration,
} from './constants'
import { eg as egInfo, EGInfo } from './eg'
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
  Transition,
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

const defaultInflectionPoint = 0.25

/**
 * Straight lines. Linear up and down.
 * @param completedProgress 0-1
 */
function getAsymmetricLinearBounce(
  completedProgress: number,
  inflectionPoint = defaultInflectionPoint
): number {
  // Validate input ranges
  if (completedProgress < 0) return 0
  if (completedProgress > 1) return 1
  if (inflectionPoint < 0) inflectionPoint = 0
  if (inflectionPoint > 1) inflectionPoint = 1

  if (completedProgress < inflectionPoint) {
    // map input 0-inflectionPoint to 0-1
    return completedProgress / inflectionPoint
  }

  // Handle down slope
  return (1 - completedProgress) / (1 - inflectionPoint)
}

/**
 * Maps an input value from 0-1 to a half period of a cosine function, starting at 0 and ending at 1.
 * "Smooths" linear functions
 * @param input 0-1
 * @return 0-1
 */
function normalizedSinusoid(input: number): number {
  return Math.cos(2 * Math.PI * (1 - input)) / 2 + 0.5
}

function getAsymmetricSmoothBounce(
  completedProgress: number,
  inflectionPoint = defaultInflectionPoint
): number {
  return normalizedSigmoid(getAsymmetricLinearBounce(completedProgress, inflectionPoint))
  // return normalizedSinusoid(getAsymmetricLinearBounce(completedProgress, inflectionPoint))
}

/**
 * Middle is steeper than normalizedSinusoid
 * @param input 0-1
 * @see https://en.wikipedia.org/wiki/Logistic_function
 * @return 0-1
 */
function normalizedSigmoid(input: number): number {
  if (input > 1) return 1
  if (input < 0) return 0

  // "Normal" sigmoid starts climbing at about -6 and gets to 99.7% by +6
  const k = 12
  const x0 = 0.5

  // Shift so that the function is centered at an input of 0.5
  input -= x0
  // Scale to 0-1 domain
  input *= k

  return 1 / (1 + Math.exp(-input))
}

function applyGradientValue(destValue: number, valuePath: string, ctx: StateContext) {
  let nextValue = destValue
  const recentValue = ctx.recentGradientValues[valuePath]
  const [mainStateKey, ...restValuePath] = valuePath.split('.')
  const sliderFields =
    ctx.mainState[mainStateKey === 'liveMedia' ? 'liveSliderFields' : 'readySliderFields']
  const slider = sliderFields[restValuePath.join('.')]
  if (recentValue != null) {
    const smoothing = slider?.smoothing || DefaultSmoothing
    const moveAggression = smoothing <= 0 ? 1 : (1 - smoothing) / 5 + 0.02 // 0.05 is default
    nextValue = destValue * moveAggression + recentValue * (1 - moveAggression)
  }
  ctx.recentGradientValues[valuePath] = nextValue
  const lastBounceTime = ctx.bounceTimes[valuePath]
  const bounceAmount = slider?.bounceAmount || DefaultBounceAmount
  const bounceDuration = (slider?.bounceDuration || DefaultBounceDuration) * 1000
  const now = Date.now()
  const bounceProgress = lastBounceTime ? (now - lastBounceTime) / bounceDuration : 0
  // if (lastBounceTime) console.log('lastBounceTime', { valuePath, lastBounceTime, bounceProgress })
  if (bounceProgress > 0 && bounceProgress < 1) {
    const bounceRatio = getAsymmetricSmoothBounce(bounceProgress)
    const bounceDeltaValue = bounceAmount * bounceRatio
    // console.log('bounceProgress', { bounceProgress, bounceAmount, bounceRatio, bounceDeltaValue })
    nextValue += bounceDeltaValue
  }
  return nextValue
}

function colorFrame(media: ColorMedia, ctx: StateContext, mediaPath: string): Frame {
  const h = applyGradientValue(media.h, `${mediaPath}.h`, ctx)
  const s = applyGradientValue(media.s, `${mediaPath}.s`, ctx)
  const l = applyGradientValue(media.l, `${mediaPath}.l`, ctx)
  return createSolidHSLFrame(egInfo, h, s, l)
}

function videoFrameBare(media: VideoMedia, ctx: StateContext, mediaPath: string): Frame {
  const video = ctx.video.getPlayer(media.id)
  if (media.pauseOnFrame) {
    return video.readFrame() || blackFrame
  }
  if (media.params) video.setParams(media.params)
  if (media.track) {
    video.selectVideo(media.track)
    return video.consumeFrame() || blackFrame
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
  const frame = videoFrameBare(media, ctx, mediaPath)
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
      `${mediaPath}.layer.${layer.key}.blendAmount`,
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
  const now = ctx.nowTime
  // handle media.transition. and transitionStartTime and transitionEndTime
  const {
    transitionStartTime,
    transitionEndTime,
    transition: transitionSpec,
    nextActiveKey,
  } = media
  const duration = transitionSpec?.duration || DefaultTransitionDuration
  if (!activeMedia) return blackFrame
  const activeMediaKey = `${mediaPath}.item.${activeMedia.key}`

  const activeMediaFrame = activeMedia && mediaFrame(activeMedia.media, ctx, activeMediaKey)
  if (!activeMediaFrame) {
    return blackFrame
  }
  if (
    transitionSpec &&
    nextActiveKey &&
    transitionStartTime &&
    transitionEndTime
    // transitionEndTime <= now
    // now <= transitionStartTime + duration
  ) {
    // transition in progress
    const progress = (now - transitionStartTime) / duration
    const nextItem = media.sequence.find((item) => item.key === nextActiveKey)
    const nextMedia = nextItem?.media
    if (!nextMedia) return activeMediaFrame
    const nextActiveMediaKey = `${mediaPath}.item.${nextActiveKey}`
    const nextFrame = mediaFrame(nextMedia, ctx, nextActiveMediaKey)
    if (progress >= 1) return nextFrame
    return transition(egInfo, activeMediaFrame, nextFrame, transitionSpec, progress)
  }

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
  const { manual, autoManualStartValue, autoStartTime } = mainState.transitionState
  const manualGradient =
    typeof manual === 'number' ? applyGradientValue(manual, 'transitionState.manual', ctx) : null
  const manualProgress =
    manualGradient == null || autoManualStartValue != null ? null : manualGradient
  let transitionProgress = manualProgress

  if (autoStartTime && transitionProgress == null) {
    const timeSinceStart = ctx.nowTime - autoStartTime
    transitionProgress = Math.min(
      1,
      (autoManualStartValue ?? 0) + timeSinceStart / mainState.transition.duration
    )
  }

  const finalFrame = transition(
    egInfo,
    liveFrame,
    readyFrame,
    mainState.transition,
    transitionProgress || 0
  )
  return finalFrame
}

function transition(
  egInfo: EGInfo,
  frameA: Frame,
  frameB: Frame,
  transition: Transition,
  progress: number
): Frame {
  if (transition.mode === 'mix') return frameMix(egInfo, frameA, frameB, progress)
  if (transition.mode === 'add') {
    const a = frameDarken(egInfo, frameA, Math.max(0, progress * 2 - 1))
    return frameAdd(egInfo, a, frameB, Math.min(1, progress * 2))
  }
  return frameA
}

export function getEGReadyFrame(mainState: MainState, ctx: StateContext): Frame {
  return mediaFrame(mainState.readyMedia, ctx, 'readyMedia')
}
