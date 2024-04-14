import { randomUUID } from 'crypto'
import { readFileSync, writeFile } from 'fs'

import { eg as egInfo } from './eg'
import { getEGLiveFrame, getEGReadyFrame } from './eg-main'
import { egSacnService } from './eg-sacn'
import { EGVideo, egVideo } from './eg-video-playback'
import { createEGViewServer } from './eg-view-server'
import { defaultMainState, Effect, MainState, MainStateSchema, Media } from './state-schema'
import {
  getBeatEffects,
  getEffectsUI,
  getEffectUI,
  getMediaLayerUI,
  getMediaUI,
  getQuickEffects,
  getUIRoot,
  UIContext,
} from './ui'
import { createWSServer } from '../../packages/ws-server/src/ws-rnt-server'

let mainState: MainState = defaultMainState

try {
  const mainStateJson = readFileSync('./main-state.json', { encoding: 'utf-8' })
  const state = MainStateSchema.safeParse(JSON.parse(mainStateJson))
  if (!state.success)
    throw new Error('Invalid saved state: ' + state.error.issues.map((i) => i.message).join(', '))
  if (!state.data) throw new Error('Invalid saved state')
  mainState = state.data
} catch (e) {
  console.log('Error loading main state', e)
}

const eg = egSacnService(egInfo)
const liveViewServer = createEGViewServer(3889)
const readyViewServer = createEGViewServer(3888)

const video = egVideo(egInfo, process.env.EG_MEDIA_PATH || 'eg-media', {
  // const video = egVideo(egInfo, process.env.EG_MEDIA_PATH || 'eg-media-2', {
  onPlayerUpdate: (player) => {
    updateUI()
  },
  onMediaUpdate: (media) => {
    wsServer.update('videoList', [
      { key: 'none', label: 'None' },
      ...media.files.map((m) => ({ key: m.fileSha256, label: m.title })),
    ])
  },
})

function mainLoop() {
  const nowTime = Date.now()
  const relativeTime = nowTime - startTime
  const context = { time: startTime, nowTime, relativeTime, video }

  wsServer.update('relativeTime', relativeTime)

  const egReadyFrame = getEGReadyFrame(mainState, context)
  const egLiveFrame = getEGLiveFrame(mainState, context, egReadyFrame)
  eg.sendFrame(egLiveFrame)
  liveViewServer.sendFrame(egLiveFrame)
  readyViewServer.sendFrame(egReadyFrame)
}

const mainAnimationFPS = 30

const wsServer = createWSServer(3990)

const startTime = Date.now()
const startTimeExact = performance.now()

const desiredMsPerFrame = 1000 / mainAnimationFPS

performMainLoopStep(desiredMsPerFrame)

const initTime = performance.now()
const lastFrameTime: number = initTime

mainLoop()

let frameCount = 0

function performMainLoopStep(inMs: number) {
  const frameScheduleTime = performance.now()
  setTimeout(() => {
    const preFrameTime = performance.now()
    mainLoop()
    frameCount += 1
    const afterFrameTime = performance.now()
    const frameDuration = afterFrameTime - preFrameTime
    if (frameDuration > desiredMsPerFrame) {
      console.log('frame took too long', frameDuration)
    }
    const frameIdealStartTime = initTime + frameCount * desiredMsPerFrame
    if (afterFrameTime > frameIdealStartTime) {
      console.log('frame behind', afterFrameTime - frameIdealStartTime)
      // missed this frame. just go to the next one
      frameCount += 1
      performMainLoopStep(0)
      return
    }
    performMainLoopStep(Math.max(1, frameIdealStartTime - afterFrameTime))
  }, inMs)
}

wsServer.update('startTime', startTime)

function updateMediaChildrenUI(mediaKey: string, mediaState: Media, uiContext: UIContext) {
  if (mediaState.type === 'video') {
    wsServer.update(`${mediaKey}:effects`, getEffectsUI(mediaKey, mediaState.effects))
    mediaState.effects?.forEach((effect) => {
      wsServer.update(
        `${mediaKey}:effects:${effect.key}`,
        getEffectUI([mediaKey, effect.key], effect)
      )
    })
    return
  }
}

function updateMediaUI(mediaKey: string, mediaState: Media, uiContext: UIContext) {
  wsServer.update(mediaKey, getMediaUI(mediaKey, mediaState, uiContext))
  if (mediaState.type === 'video') {
    updateMediaChildrenUI(mediaKey, mediaState, uiContext)
    return
  }
  if (mediaState.type === 'layers') {
    mediaState.layers?.forEach((layer) => {
      const layerKey = `${mediaKey}:layer:${layer.key}`
      wsServer.update(layerKey, getMediaLayerUI(layerKey, layer, uiContext))
      updateMediaChildrenUI(layerKey, layer.media, uiContext)
    })
    return
  }
}

function updateUI() {
  const uiContext: UIContext = { video }
  wsServer.update('mainState', mainState)
  wsServer.updateRoot(getUIRoot(mainState))
  wsServer.update('quickEffects', getQuickEffects(mainState))
  wsServer.update('beatEffects', getBeatEffects(mainState))
  updateMediaUI('readyMedia', mainState.readyMedia, uiContext)
  updateMediaUI('liveMedia', mainState.liveMedia, uiContext)
}
updateUI()

let mainStateToDiskTimeout: undefined | NodeJS.Timeout = undefined

function mainStateUpdate(updater: (state: MainState) => MainState) {
  clearTimeout(mainStateToDiskTimeout)
  const prevState = mainState
  mainState = updater(mainState)
  updateUI()
  mainStateToDiskTimeout = setTimeout(() => {
    writeFile('./main-state.json', JSON.stringify(mainState), () => {})
  }, 500)
  mainStateEffect(mainState, prevState)
}

function mainStateEffect(state: MainState, prevState: MainState) {
  setTimeout(() => {
    if (state.transitionState.manual === 1) {
      mainStateUpdate((state) => ({
        ...state,
        readyMedia: state.liveMedia,
        liveMedia: state.readyMedia,
        transitionState: { manual: null, autoStartTime: null },
      }))
    } else if (state.transitionState.autoStartTime) {
      const progress = Math.min(
        1,
        (Date.now() - state.transitionState.autoStartTime) / state.transition.duration
      )
      console.log('progress', progress)
      mainStateUpdate((state) => ({
        ...state,
        transitionState: { ...state.transitionState, manual: progress },
      }))
    }
  }, 80)
}

function sliderUpdate(
  event: readonly [string, string, number, any],
  pathToCheck: string,
  statePath: string[]
): boolean {
  const [path, name, value] = event

  if (path === pathToCheck && name === 'update') {
    mainStateUpdate((state: MainState) => updateState(state, statePath, value[0]))
    return true
  }
  return false
}

function switchUpdate(
  event: readonly [string, string, boolean, any],
  pathToCheck: string,
  statePath: string[]
): boolean {
  const [path, name, value] = event

  if (path === pathToCheck && name === 'update') {
    mainStateUpdate((state: MainState) => updateState(state, statePath, value))
    return true
  }
  return false
}

function updateState(state: any, path: string[], value: any): any {
  if (path.length === 0) return value
  const [first, ...rest] = path
  return {
    ...state,
    [first]: updateState(state[first] ?? {}, rest, value),
  }
}

let manualTapBeatCount = 0
let manualTapBeatStart = 0
let manualTapBeatLastTime = 0
let manualTapBeatTimeout: undefined | NodeJS.Timeout = undefined

function handleManualTapBeat() {
  const now = Date.now()
  manualTapBeatCount += 1
  manualTapBeatLastTime = now
  if (manualTapBeatStart === 0) {
    manualTapBeatStart = now
  }
  if (manualTapBeatCount > 2) {
    const bpm = (manualTapBeatCount - 1) / ((now - manualTapBeatStart) / 60_000)
    const lastBeatTime = now
    console.log('manual tap beat update', bpm, lastBeatTime)
    mainStateUpdate((state) => ({
      ...state,
      manualBeat: { ...state.manualBeat, bpm, lastBeatTime: manualTapBeatLastTime },
    }))
  }

  clearTimeout(manualTapBeatTimeout)
  manualTapBeatTimeout = setTimeout(() => {
    manualTapBeatCount = 0
    manualTapBeatStart = 0
    manualTapBeatLastTime = 0
  }, 2000)
}

wsServer.subscribeEvent((...event) => {
  const [path, name, value] = event
  if (path === 'offButton' && name === 'press') {
    mainStateUpdate((state) => ({ ...state, mode: 'off' }))
    return
  }
  if (path === 'whiteoutButton' && name === 'press') {
    mainStateUpdate((state) => ({ ...state, mode: 'white' }))
    return
  }
  if (path === 'rainbowButton' && name === 'press') {
    mainStateUpdate((state) => ({ ...state, mode: 'rainbow' }))
    return
  }
  if (path === 'mode' && name === 'update') {
    mainStateUpdate((state) => ({ ...state, mode: value as MainState['mode'] }))
    return
  }
  if (sliderUpdate(event, 'hueSlider', ['color', 'h'])) return
  if (sliderUpdate(event, 'saturationSlider', ['color', 's'])) return
  if (sliderUpdate(event, 'lightnessSlider', ['color', 'l'])) return
  if (sliderUpdate(event, 'beatEffects.effect.intensity', ['beatEffect', 'intensity'])) return
  if (sliderUpdate(event, 'beatEffects.effect.waveLength', ['beatEffect', 'waveLength'])) return
  if (sliderUpdate(event, 'beatEffects.effect.dropoff', ['beatEffect', 'dropoff'])) return
  if (path === 'testSlider' && name === 'update') {
    wsServer.update('testValue', value)
    return
  }
  // const matchingEffect: undefined | keyof typeof effectsSchema = effectTypes.find(
  //   (effect) => 'quickEffects.' + effect === path
  // )
  // if (name === 'press' && matchingEffect) {
  //   mainStateUpdate((state) => ({
  //     ...state,
  //     effects: { ...state.effects, [matchingEffect]: Date.now() },
  //   }))
  //   return
  // }
  // manual beat
  if (switchUpdate(event, 'beatEffects.manualBeat.manualBeatEnabled', ['manualBeat', 'enabled']))
    return
  if (value[0] === 'manualTapBeat') {
    handleManualTapBeat()
    return
  }
  if (path === 'beatEffects.effect.effect' && name === 'update') {
    mainStateUpdate((state) => ({
      ...state,
      beatEffect: { ...state.beatEffect, effect: value as MainState['beatEffect']['effect'] },
    }))
    return
  }
  if (path === 'selectVideo' && name === 'update') {
    mainStateUpdate((state) => ({
      ...state,
      video: { ...state.video, track: value as string },
    }))
    return
  }
  // if (path === 'restart' && name === 'press') {
  //   const player = getVideoPlayback(mainState.video.track)
  //   if (player) {
  //     player.restart()
  //   }
  //   return
  // }

  // const mediaPath = path.split(':')
  if (value[0] === 'updateMedia') {
    const [_updateMedia, mediaKey, ...restUpdate] = value
    if (handleMediaEvent(mediaKey.split(':'), name, restUpdate)) return
  }
  if (handleTransitionEvent(path, name, value)) return
  if (handleEffectEvent(path, name, value)) return

  console.log('Unknown Event', path, name, value)
})

function handleEffectEvent(path: string, name: string, value: any): boolean {
  if (value?.[0] !== 'updateEffect') return false
  const mediaPath = value?.[1]?.[0]?.split(':')
  const effectKey = value?.[1]?.[1]
  console.log('handleEffectEvent', mediaPath, effectKey, value?.[2], value?.[3])
  rootMediaUpdate(mediaPath, (media) => {
    if (media.type !== 'video' || !media.effects) return media
    const effectIndex = media?.effects?.findIndex((effect) => effect.key === effectKey)
    if (effectIndex === -1) return media
    if (value?.[2] === 'remove') {
      return {
        ...media,
        effects: media.effects.filter((effect) => {
          return effect.key !== effectKey
        }),
      }
    }
    if (effectIndex != null && effectIndex !== -1) {
      const field = value[2]
      const newValue = value[3]
      const effect = media.effects[effectIndex]
      const newEffect = { ...effect, [field]: newValue }
      return {
        ...media,
        effects: media.effects.map((effect) => {
          if (effect.key === effectKey) {
            return newEffect
          }
          return effect
        }),
      }
    }
    return state
  })
  return true
}

function handleTransitionEvent(path: string, name: string, value: any): boolean {
  if (value?.[0] !== 'updateTransition') return false
  if (value?.[1] === 'manual') {
    mainStateUpdate((state) => ({
      ...state,
      transitionState: {
        ...state.transitionState,
        manual: value[2],
      },
    }))
    return true
  }
  if (value?.[1] === 'duration') {
    mainStateUpdate((state) => ({
      ...state,
      transition: {
        ...state.transition,
        duration: value[2],
      },
    }))
    return true
  }
  if (value?.[1] === 'startAuto') {
    mainStateUpdate((state) => ({
      ...state,
      transitionState: {
        ...state.transitionState,
        autoStartTime: Date.now(),
      },
    }))
    return true
  }
  return false
}

function mediaUpdate(
  mediaPath: string[],
  prevMedia: Media,
  updater: (media: Media) => Media
): Media {
  if (mediaPath.length === 0) return updater(prevMedia)
  const [subMediaKey, ...restMediaPath] = mediaPath
  if (subMediaKey === 'layer' && prevMedia.type === 'layers') {
    const [layerKey, ...subMediaPath] = restMediaPath
    // console.log('layer update', { layerKey, subMediaPath, prevMedia })
    return {
      ...prevMedia,
      layers: prevMedia.layers?.map((layer) => {
        if (layer.key === layerKey) {
          return {
            ...layer,
            media: mediaUpdate(subMediaPath, layer.media, updater),
          }
        }
        return layer
      }),
    }
  }
  console.log('unhandled deep mediaUpdate', { subMediaKey, restMediaPath, prevMedia })
  throw new Error('todo')
  return prevMedia
}

function rootMediaUpdate(mediaPath: string[], updater: (media: Media) => Media) {
  // console.log('mediaUpdate', mediaPath)
  const [rootMediaKey, ...restMediaPath] = mediaPath
  if (rootMediaKey !== 'liveMedia' && rootMediaKey !== 'readyMedia') {
    throw new Error('Invalid root media key')
  }
  mainStateUpdate((state) => {
    const prevMedia = state[rootMediaKey]
    return {
      ...state,
      [rootMediaKey]: mediaUpdate(restMediaPath, prevMedia, updater),
    }
  })
}

function handleMediaEvent(mediaPath: string[], eventName: string, value: any[]): boolean {
  // console.log('handleMediaEvent', mediaPath, eventName, value)
  const action = value?.[0]
  if (action === 'clear') {
    rootMediaUpdate(mediaPath, () => createBlankMedia('off'))
    return true
  }
  if (action === 'mode') {
    const mode = value?.[1]
    rootMediaUpdate(mediaPath, () => createBlankMedia(mode))
    return true
  }
  if (action === 'color') {
    const colorField = value?.[1]
    const number = value?.[2]
    if (colorField === 'h' || colorField === 's' || colorField === 'l') {
      rootMediaUpdate(mediaPath, (media) => ({ ...media, [colorField]: number }))
      return true
    }
  }
  if (action === 'track') {
    const track = value?.[1]
    // console.log('track update', mediaPath, track)
    rootMediaUpdate(mediaPath, (media) => ({ ...media, track }))
    return true
  }
  if (action === 'loopBounce' && eventName === 'switch') {
    const loopBounce = value?.[1]
    rootMediaUpdate(mediaPath, (media) => ({
      ...media,
      params: {
        ...(media.params || {}),
        loopBounce,
      },
    }))
    return true
  }
  if (action === 'reverse' && eventName === 'switch') {
    const reverse = value?.[1]
    rootMediaUpdate(mediaPath, (media) => ({
      ...media,
      params: {
        ...(media.params || {}),
        reverse,
      },
    }))
    return true
  }
  if (action === 'addEffect') {
    const effectType = value?.[1]
    const newEffect: Effect = createBlankEffect(effectType)
    rootMediaUpdate(mediaPath, (media) => ({
      ...media,
      effects: [...(media.effects || []), newEffect],
    }))
    return true
  }
  if (action === 'addLayer') {
    const mediaType = value?.[1]
    rootMediaUpdate(mediaPath, (media) => {
      if (media.type !== 'layers') return media
      return {
        ...media,
        layers: [
          ...(media.layers || []),
          {
            key: randomUUID(),
            media: createBlankMedia(mediaType),
            blendMode: 'mix',
            blendAmount: 0,
          },
        ],
      }
    })
    return true
  }
  if (action === 'blendMode' && mediaPath.at(-2) === 'layer') {
    const layerKey = mediaPath.at(-1)
    const blendMode = value?.[1]
    const targetPath = mediaPath.slice(0, -2)
    rootMediaUpdate(targetPath, (media) => {
      if (media.type !== 'layers') return media
      return {
        ...media,
        layers: (media.layers || []).map((layer) => {
          if (layer.key === layerKey) {
            return { ...layer, blendMode }
          }
          return layer
        }),
      }
    })
    return true
  }
  if (action === 'blendAmount' && mediaPath.at(-2) === 'layer') {
    const layerKey = mediaPath.at(-1)
    const blendAmount = value?.[1]
    const targetPath = mediaPath.slice(0, -2)
    rootMediaUpdate(targetPath, (media) => {
      if (media.type !== 'layers') return media
      return {
        ...media,
        layers: (media.layers || []).map((layer) => {
          if (layer.key === layerKey) {
            return { ...layer, blendAmount }
          }
          return layer
        }),
      }
    })
    return true
  }
  if (action === 'layerOrder') {
    const order = value?.[1]
    rootMediaUpdate(mediaPath, (media) => {
      if (media.type !== 'layers') return media
      return {
        ...media,
        layers: order.map((key: string) => {
          const layer = media.layers?.find((layer) => layer.key === key)
          if (!layer) throw new Error('Invalid layer order')
          return layer
        }),
      }
    })
    return true
  }
  if (action === 'removeLayer') {
    const targetPath = mediaPath.slice(0, -2)
    const layerKey = value?.[1]
    // console.log('remove layer', layerKey, targetPath)
    rootMediaUpdate(targetPath, (media) => {
      if (media.type !== 'layers') return media
      return {
        ...media,
        layers: (media.layers || []).filter((layer) => layer.key !== layerKey),
      }
    })
    return true
  }

  return false
}

// stagelinqInterface({
//   quiet: true,
//   onConnectionStatus: (status) => {
//     // console.log('stagelinq connection status', status)
//     wsServer.update('stagelinqConnection', status)
//   },
//   newBeatInfo: (info) => {
//     // console.log(info.lastBeatTime)
//     // console.log('new beat info', info)
//     stagelinqBpm = info.bpm
//     stagelinqLastBeatTime = info.lastBeatTime
//     stagelinqLastMeasureTime = info.lastMeasureTime
//     // info.bpm
//   },
// })

function createBlankMedia(type: Media['type']): Media {
  if (type === 'off') {
    return { type }
  }
  if (type === 'color') {
    return { type, h: 0, s: 1, l: 1 }
  }
  if (type === 'video') {
    return { type, track: null, id: randomUUID() }
  }
  if (type === 'layers') {
    return { type, layers: [] }
  }
  if (type === 'sequence') {
    return { type, sequence: [] }
  }

  return { type: 'off' }
}

function createBlankEffect(type: Effect['type']): Effect {
  if (type === 'hueShift')
    return {
      key: randomUUID(),
      type: 'hueShift',
      value: 0,
    }
  if (type === 'desaturate')
    return {
      key: randomUUID(),
      type: 'desaturate',
      value: 0,
    }
  if (type === 'colorize')
    return {
      key: randomUUID(),
      type: 'colorize',
      amount: 0,
      saturation: 1,
      hue: 180,
    }
  if (type === 'darken')
    return {
      key: randomUUID(),
      type: 'darken',
      value: 0,
    }
  if (type === 'brighten')
    return {
      key: randomUUID(),
      type: 'brighten',
      value: 0,
    }
  if (type === 'rotate') {
    return {
      key: randomUUID(),
      type: 'rotate',
      value: 0,
    }
  }
  // if (type === 'invert')
  return {
    key: randomUUID(),
    type: 'invert',
  }
}
