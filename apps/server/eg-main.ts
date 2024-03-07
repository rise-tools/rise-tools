import { eg as egInfo } from './eg'
import { Frame } from './eg-sacn'
import {
  createRainbowFrame,
  createSolidHSLFrame,
  createSolidRGBFrame,
  flashEffect,
  waveFrameLayerEffect,
} from './eg-tools'
import { EGVideo, VideoPlayer } from './eg-video-playback'
import { MainState, StateContext, effectTypes, effectsSchema } from './state-schema'

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

const egEffectAppliers: Record<
  keyof typeof effectsSchema,
  (frame: Uint8Array, progress: number, intensity: number, waveLength: number) => Uint8Array
> = {
  flash: flashEffect(egInfo),
  waveIn: waveFrameLayerEffect(egInfo, true),
  waveOut: waveFrameLayerEffect(egInfo, false),
}

let stagelinqLastBeatTime = 0
let stagelinqLastMeasureTime = 0
let stagelinqBpm = 0

const effectDuration = 1000
function applyEGEffects(mainState: MainState, ctx: StateContext, frame: Uint8Array): Uint8Array {
  let outputFrame = frame
  const { nowTime } = ctx
  effectTypes.forEach((effectName) => {
    const applier = egEffectAppliers[effectName]
    const lastEffectTime = mainState.effects[effectName]
    if (lastEffectTime !== null) {
      const quickEffectAmount = Math.min(
        1,
        Math.max(0, (nowTime - lastEffectTime) / effectDuration)
      )
      if (quickEffectAmount > 0) {
        outputFrame = applier(outputFrame, quickEffectAmount, 1, 0.5)
      }
    }
  })
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

export function getEGLiveFrame(mainState: MainState, ctx: StateContext): Frame {
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

export function getEGReadyFrame(mainState: MainState, ctx: StateContext): Frame {
  return whiteFrame
}
