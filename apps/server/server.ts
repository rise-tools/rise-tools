import { TemplateEvent } from '@react-native-templates/core'
import { createWSServer } from '@react-native-templates/ws-server'
import { randomUUID } from 'crypto'
import { existsSync, readFileSync, writeFile } from 'fs'

import { eg as egInfo } from './eg'
import { getEGLiveFrame, getEGReadyFrame } from './eg-main'
import { egSacnService } from './eg-sacn'
import { egVideo } from './eg-video-playback'
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

let mainState: MainState = defaultMainState

// Load previous state if there's one present
if (existsSync('./main-state.json')) {
  try {
    const mainStateJson = readFileSync('./main-state.json', { encoding: 'utf-8' })
    const state = MainStateSchema.safeParse(JSON.parse(mainStateJson))
    if (!state.success) {
      throw new Error('Invalid saved state: ' + state.error.issues.map((i) => i.message).join(', '))
    }
    if (!state.data) {
      throw new Error('Invalid saved state')
    }
    mainState = state.data
  } catch (e) {
    console.log('Error loading main state', e)
  }
}

const eg = egSacnService(egInfo)
const liveViewServer = createEGViewServer(3889)
const readyViewServer = createEGViewServer(3888)

const video = egVideo(egInfo, process.env.EG_MEDIA_PATH || 'eg-media', {
  // const video = egVideo(egInfo, process.env.EG_MEDIA_PATH || 'eg-media-2', {
  onPlayerUpdate: () => {
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
  wsServer.update('quickEffects', getQuickEffects())
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

function sliderUpdate(event: TemplateEvent, pathToCheck: string, statePath: string[]): boolean {
  if (
    event.target.key === pathToCheck &&
    event.name === 'onValueChange' &&
    event.target.component === 'RiseSliderField'
  ) {
    mainStateUpdate((state: MainState) => updateState(state, statePath, event.payload[0]))
    return true
  }
  return false
}

function switchUpdate(event: TemplateEvent, pathToCheck: string, statePath: string[]): boolean {
  if (
    event.target.key === pathToCheck &&
    event.name === 'onCheckedChange' &&
    event.target.component === 'RiseSwitch'
  ) {
    mainStateUpdate((state: MainState) => updateState(state, statePath, event.payload))
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

wsServer.subscribeEvent((event) => {
  const {
    target: { key },
    name,
    action,
  } = event
  if (key === 'offButton' && name === 'onPress') {
    mainStateUpdate((state) => ({ ...state, mode: 'off' }))
    return
  }
  if (key === 'mode' && name === 'onValueChange') {
    mainStateUpdate((state) => ({ ...state, mode: event.payload }))
    return
  }
  if (sliderUpdate(event, 'hueSlider', ['color', 'h'])) return
  if (sliderUpdate(event, 'saturationSlider', ['color', 's'])) return
  if (sliderUpdate(event, 'lightnessSlider', ['color', 'l'])) return
  if (sliderUpdate(event, 'intensitySlider', ['beatEffect', 'intensity'])) return
  if (sliderUpdate(event, 'waveLengthSlider', ['beatEffect', 'waveLength'])) return
  if (sliderUpdate(event, 'dropoffSlider', ['beatEffect', 'dropoff'])) return
  if (switchUpdate(event, 'manualBeatEnabledSwitch', ['manualBeat', 'enabled'])) return
  if (action === 'manualTapBeat') {
    handleManualTapBeat()
    return
  }
  if (key === 'effectSelect' && name === 'onValueChange') {
    mainStateUpdate((state) => ({
      ...state,
      beatEffect: {
        ...state.beatEffect,
        effect: event.payload as MainState['beatEffect']['effect'],
      },
    }))
    return
  }
  if (key === 'selectVideo' && name === 'onValueChange') {
    mainStateUpdate((state) => ({
      ...state,
      video: { ...state.video, track: event.payload as string },
    }))
    return
  }
  if (handleMediaEvent(event)) return
  if (handleTransitionEvent(event)) return
  if (handleEffectEvent(event)) return

  console.log('Unknown event', event)
})

// tbd: convert this to EffectEvent type and type all possible occurences
type ServerAction = string | string[]

function handleEffectEvent(event: TemplateEvent<ServerAction>): boolean {
  const actionName = event.action?.[0]
  if (actionName !== 'updateEffect') {
    return false
  }

  const mediaPath = event.action?.[1]?.[0]?.split(':')
  const effectKey = event.action?.[1]?.[1]
  const effectField = event.action?.[2]

  if (!mediaPath || !effectKey || !effectField) {
    console.warn('Invalid effect event', event)
    return false
  }

  rootMediaUpdate(mediaPath, (media): Media => {
    if (media.type !== 'video' || !media.effects) {
      return media
    }
    const effectIndex = media.effects.findIndex((effect) => effect.key === effectKey)
    if (effectIndex === -1) {
      return media
    }
    if (effectField === 'remove') {
      return {
        ...media,
        effects: media.effects.filter((effect) => {
          return effect.key !== effectKey
        }),
      }
    }
    if (effectIndex != null && effectIndex !== -1) {
      const effect = media.effects[effectIndex]
      const newEffect = { ...effect, [effectField]: event.payload[0] }
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
    return media
  })
  return true
}

function handleTransitionEvent(event: TemplateEvent<ServerAction>): boolean {
  if (event.action?.[0] !== 'updateTransition') {
    return false
  }
  if (event.action?.[1] === 'manual') {
    mainStateUpdate((state) => ({
      ...state,
      transitionState: {
        ...state.transitionState,
        manual: event.payload[0],
      },
    }))
    return true
  }
  if (event.action?.[1] === 'duration') {
    mainStateUpdate((state) => ({
      ...state,
      transition: {
        ...state.transition,
        duration: event.payload[0],
      },
    }))
    return true
  }
  if (event.action?.[1] === 'startAuto') {
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

// function handleMediaEvent(mediaPath: string[], eventName: string, value: any[]): boolean {
function handleMediaEvent(event: TemplateEvent<ServerAction>): boolean {
  if (event.action?.[0] !== 'updateMedia') {
    return false
  }

  const mediaPath = event.action?.[1]?.split(':')
  const action = event.action?.[2]
  if (!mediaPath || !action) {
    console.warn('Invalid media event', event)
    return false
  }

  if (action === 'clear') {
    rootMediaUpdate(mediaPath, () => createBlankMedia('off'))
    return true
  }
  if (action === 'mode') {
    const mode = event.payload
    rootMediaUpdate(mediaPath, () => createBlankMedia(mode))
    return true
  }
  if (action === 'color') {
    const colorField = event.action?.[3]
    const number = event.payload[0]
    if (colorField === 'h' || colorField === 's' || colorField === 'l') {
      rootMediaUpdate(mediaPath, (media) => ({ ...media, [colorField]: number }))
      return true
    }
  }
  if (action === 'track') {
    const track = event.payload
    rootMediaUpdate(mediaPath, (media) => ({ ...media, track }))
    return true
  }
  if (action === 'loopBounce') {
    const loopBounce = event.payload
    rootMediaUpdate(mediaPath, (media) => {
      if (media.type !== 'video') {
        console.warn('loopBounce on non-video media', media)
        return media
      }
      return {
        ...media,
        params: {
          ...(media.params || {}),
          loopBounce,
        },
      }
    })
    return true
  }
  if (action === 'reverse') {
    const reverse = event.payload
    rootMediaUpdate(mediaPath, (media) => {
      if (media.type !== 'video') {
        console.warn('reverse on non-video media', media)
        return media
      }
      return {
        ...media,
        params: {
          ...(media.params || {}),
          reverse,
        },
      }
    })
    return true
  }
  if (action === 'addEffect') {
    const effectType = event.payload
    const newEffect: Effect = createBlankEffect(effectType)
    rootMediaUpdate(mediaPath, (media) => {
      if (media.type !== 'video') {
        console.warn('addEffect on non-video media', media)
        return media
      }
      return {
        ...media,
        effects: [...(media.effects || []), newEffect],
      }
    })
    return true
  }
  if (action === 'addLayer') {
    const mediaType = event.payload
    rootMediaUpdate(mediaPath, (media) => {
      if (media.type !== 'layers') {
        console.warn('addLayer on non-layer media', media)
        return media
      }
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
  if (action === 'blendMode') {
    const layerKey = mediaPath.at(-1)
    const blendMode = event.payload
    const targetPath = mediaPath.slice(0, -2)
    rootMediaUpdate(targetPath, (media) => {
      if (media.type !== 'layers') {
        console.warn('blendMode on non-layer media', media)
        return media
      }
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
  if (action === 'blendAmount') {
    const layerKey = mediaPath.at(-1)
    const blendAmount = event.payload[0]
    const targetPath = mediaPath.slice(0, -2)
    rootMediaUpdate(targetPath, (media) => {
      if (media.type !== 'layers') {
        console.warn('blendMode on non-layer media', media)
        return media
      }
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
    const order = event.payload
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
    const layerKey = event.payload
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
