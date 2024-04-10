import { eg as egInfo } from './eg'
import { Frame } from './eg-sacn'
import {
  createRainbowFrame,
  createSolidHSLFrame,
  createSolidRGBFrame,
  flashEffect,
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
  frameTransitionMix,
  waveFrameLayerEffect,
} from './eg-tools'
import { EGVideo, VideoPlayer } from './eg-video-playback'
import { UPRISING } from './flag'
import {
  BrightenEffect,
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
  StateContext,
  Transition,
  TransitionState,
  VideoMedia,
  // effectTypes,
  // effectsSchema,
} from './state-schema'

const readyVideoPlayers: Record<string, undefined | VideoPlayer> = {}
const loadingVideoPlayers: Record<string, undefined | Promise<void>> = {}

function getVideoPlayback(video: EGVideo, fileId: string) {
  if (readyVideoPlayers[fileId]) return readyVideoPlayers[fileId]
  if (loadingVideoPlayers[fileId]) return null
  loadingVideoPlayers[fileId] = video
    .loadVideo(fileId)
    .then((player) => {
      readyVideoPlayers[fileId] = player
    })
    .catch((e) => {
      console.error('Error loading video', e)
    })
    .finally(() => {
      delete loadingVideoPlayers[fileId]
    })
}

// const egEffectAppliers: Record<
//   keyof typeof effectsSchema,
//   (frame: Uint8Array, progress: number, intensity: number, waveLength: number) => Uint8Array
// > = {
//   flash: flashEffect(egInfo),
//   waveIn: waveFrameLayerEffect(egInfo, true),
//   waveOut: waveFrameLayerEffect(egInfo, false),
// }

const stagelinqLastBeatTime = 0
const stagelinqLastMeasureTime = 0
const stagelinqBpm = 0

const effectDuration = 1000
function applyEGEffects(mainState: MainState, ctx: StateContext, frame: Uint8Array): Uint8Array {
  let outputFrame = frame
  const { nowTime } = ctx
  // effectTypes.forEach((effectName) => {
  //   const applier = egEffectAppliers[effectName]
  //   const lastEffectTime = mainState.effects[effectName]
  //   if (lastEffectTime !== null) {
  //     const quickEffectAmount = Math.min(
  //       1,
  //       Math.max(0, (nowTime - lastEffectTime) / effectDuration)
  //     )
  //     if (quickEffectAmount > 0) {
  //       outputFrame = applier(outputFrame, quickEffectAmount, 1, 0.5)
  //     }
  //   }
  // })
  // apply manual beat effect
  if (mainState.manualBeat.enabled && false) {
    const manualBeatEffectDuration = 60_000 / mainState.manualBeat.bpm
    const applyEffect = egEffectAppliers[mainState.beatEffect.effect]
    const beatsPassed = ~~((nowTime - mainState.manualBeat.lastBeatTime) / manualBeatEffectDuration)
    const lastEffectTime =
      mainState.manualBeat.lastBeatTime + beatsPassed * manualBeatEffectDuration
    if (lastEffectTime !== null) {
      const beatEffectProgress = Math.min(
        1,
        Math.max(0, (nowTime - lastEffectTime) / manualBeatEffectDuration)
      )
      if (beatEffectProgress > 0) {
        outputFrame = applyEffect(
          outputFrame,
          beatEffectProgress,
          (mainState.beatEffect.intensity / 100) *
            (1 - mainState.beatEffect.dropoff * beatEffectProgress),
          mainState.beatEffect.waveLength
        )
      }
    }
  }

  if (stagelinqBpm && stagelinqLastMeasureTime && false) {
    const beatEffectDuration = (60_000 / stagelinqBpm) * 4
    const applyEffect = egEffectAppliers[mainState.beatEffect.effect]
    const beatsPassed = ~~((nowTime - stagelinqLastMeasureTime) / beatEffectDuration)
    const lastEffectTime = stagelinqLastMeasureTime + beatsPassed * beatEffectDuration
    if (lastEffectTime !== null) {
      const beatEffectProgress = Math.min(
        1,
        Math.max(0, (nowTime - lastEffectTime) / beatEffectDuration)
      )
      // console.log('beat effect progress', beatEffectProgress, stagelinqBpm, stagelinqLastBeatTime)
      if (beatEffectProgress > 0) {
        outputFrame = applyEffect(
          outputFrame,
          beatEffectProgress,
          (mainState.beatEffect.intensity / 100) *
            (1 - mainState.beatEffect.dropoff * beatEffectProgress),
          mainState.beatEffect.waveLength
        )
      }
    }
  }
  return outputFrame
}

const blackFrame = createSolidRGBFrame(egInfo, 0, 0, 0)
const whiteFrame = createSolidRGBFrame(egInfo, 255, 255, 255)

function colorFrame(media: ColorMedia, ctx: StateContext): Frame {
  return createSolidHSLFrame(egInfo, media.h, media.s, media.l)
}

function videoFrameBare(media: VideoMedia, ctx: StateContext): Frame {
  const video = ctx.video.getPlayer(media.id)
  if (media.params) video.setParams(media.params)
  if (media.track) {
    video.selectVideo(media.track).catch((e) => {
      console.error('Error selecting video', e)
    })
    return video.readFrame() || blackFrame
  }
  return blackFrame
}

function withColorize(frame: Frame, effect: ColorizeEffect, ctx: StateContext): Frame {
  return frameColorize(egInfo, frame, effect.amount, effect.hue, effect.saturation)
}

function withDesaturate(frame: Frame, effect: DesaturateEffect, ctx: StateContext): Frame {
  return frameDesaturate(egInfo, frame, effect.value)
}

function withHueShift(frame: Frame, effect: HueShiftEffect, ctx: StateContext): Frame {
  return frameHueShift(egInfo, frame, effect.value)
}

function withRotate(frame: Frame, effect: RotateEffect, ctx: StateContext): Frame {
  return frameRotate(egInfo, frame, effect.value)
}

function withInvert(frame: Frame, effect: InvertEffect, ctx: StateContext): Frame {
  return frameInvert(egInfo, frame)
}

function withBrighten(frame: Frame, effect: BrightenEffect, ctx: StateContext): Frame {
  return frameBrighten(egInfo, frame, effect.value)
}

function withDarken(frame: Frame, effect: DarkenEffect, ctx: StateContext): Frame {
  return frameDarken(egInfo, frame, effect.value)
}

function withMediaEffect(frame: Frame, effect: Effect, ctx: StateContext): Frame {
  if (effect.type === 'colorize') return withColorize(frame, effect, ctx)
  if (effect.type === 'desaturate') return withDesaturate(frame, effect, ctx)
  if (effect.type === 'hueShift') return withHueShift(frame, effect, ctx)
  if (effect.type === 'invert') return withInvert(frame, effect, ctx)
  if (effect.type === 'brighten') return withBrighten(frame, effect, ctx)
  if (effect.type === 'darken') return withDarken(frame, effect, ctx)
  if (effect.type === 'rotate') return withRotate(frame, effect, ctx)
  return frame
}

function withMediaEffects(frame: Frame, effects: Effects | undefined, ctx: StateContext): Frame {
  let outFrame = frame
  effects?.forEach((effect) => {
    outFrame = withMediaEffect(outFrame, effect, ctx)
  })
  return outFrame
}

function videoFrame(media: VideoMedia, ctx: StateContext): Frame {
  const frame = videoFrameBare(media, ctx)
  return withMediaEffects(frame, media.effects, ctx)
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

function layersFrame(media: LayersMedia, ctx: StateContext): Frame {
  const reverseLayers = media.layers.slice(0, -1).reverse()
  const firstLayer = media.layers.at(-1)
  if (!firstLayer) return blackFrame
  let frame = mediaFrame(firstLayer.media, ctx)
  reverseLayers.forEach((layer) => {
    frame = layerBlend(frame, mediaFrame(layer.media, ctx), layer.blendMode, layer.blendAmount)
  })
  return frame
}

function mediaFrame(media: Media, ctx: StateContext): Frame {
  if (media.type === 'color') return colorFrame(media, ctx)
  if (media.type === 'video') return videoFrame(media, ctx)
  if (media.type === 'layers') return layersFrame(media, ctx)
  if (media.type === 'off') return blackFrame
  return blackFrame
}

function runTransition(
  frameA: Frame,
  frameB: Frame,
  transition: Transition,
  transitionState: TransitionState,
  ctx: StateContext
): Frame {
  let transitionProgresss = transitionState.manual
  if (transitionState.autoStartTime && !transitionProgresss) {
    transitionProgresss = Math.min(
      1,
      (ctx.nowTime - transitionState.autoStartTime) / transition.duration
    )
  }
  return frameMix(egInfo, frameA, frameB, transitionProgresss || 0)
}

export function getEGLiveFrameUPRISING(
  mainState: MainState,
  ctx: StateContext,
  readyFrame: Frame
): Frame {
  const liveFrame = mediaFrame(mainState.liveMedia, ctx)
  const finalFrame = runTransition(
    liveFrame,
    readyFrame,
    mainState.transition,
    mainState.transitionState,
    ctx
  )
  return finalFrame
}

export function getEGReadyFrame(mainState: MainState, ctx: StateContext): Frame {
  return mediaFrame(mainState.readyMedia, ctx)
}

export function getEGLiveFrame(mainState: MainState, ctx: StateContext, readyFrame: Frame): Frame {
  if (UPRISING) return getEGLiveFrameUPRISING(mainState, ctx, readyFrame)
  const { relativeTime } = ctx
  if (mainState.mode === 'off') return blackFrame
  if (mainState.mode === 'white') {
    return applyEGEffects(mainState, ctx, whiteFrame)
  }
  if (mainState.mode === 'color') {
    const frame = createSolidHSLFrame(
      egInfo,
      mainState.color.h,
      mainState.color.s,
      mainState.color.l
    )
    return applyEGEffects(mainState, ctx, frame)
  }
  if (mainState.mode === 'rainbow') {
    const startRatio = ~~(relativeTime % 5000) / 5000
    const frame = createRainbowFrame(egInfo, startRatio)
    return applyEGEffects(mainState, ctx, frame)
  }
  if (mainState.mode === 'video') {
    let frame = blackFrame
    if (mainState.video.track !== 'none') {
      const player = getVideoPlayback(ctx.video, mainState.video.track)
      if (player) {
        const videoFrame = player.readFrame()
        if (videoFrame) {
          frame = videoFrame
        }
      }
    }
    return applyEGEffects(mainState, ctx, frame)
  }
  return blackFrame
}
