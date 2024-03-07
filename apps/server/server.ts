import { readFileSync, writeFile } from 'fs'
import { eg as egInfo } from './eg'
import { getEGLiveFrame, getEGReadyFrame } from './eg-main'
import { egSacnService } from './eg-sacn'
import { createEGViewServer } from './eg-view-server'
import {
  MainState,
  MainStateSchema,
  defaultMainState,
  effectTypes,
  effectsSchema,
} from './state-schema'
import { getBeatEffects, getQuickEffects, getUIRoot } from './ui'
import { createWSServer } from './ws-rnt-server'
import { egVideo } from './eg-video-playback'

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

  const egLiveFrame = getEGLiveFrame(mainState, context)
  const egReadyFrame = getEGReadyFrame(mainState, context)
  eg.sendFrame(egLiveFrame)
  liveViewServer.sendFrame(egLiveFrame)
  readyViewServer.sendFrame(egReadyFrame)
}

const mainAnimationFPS = 30

setInterval(mainLoop, 1000 / mainAnimationFPS)

const wsServer = createWSServer(3990)

const startTime = Date.now()
wsServer.update('startTime', startTime)

function updateUI() {
  wsServer.update('mainState', mainState)
  wsServer.updateRoot(getUIRoot(mainState))
  wsServer.update('quickEffects', getQuickEffects(mainState))
  wsServer.update('beatEffects', getBeatEffects(mainState))
}
updateUI()

let mainStateToDiskTimeout: undefined | NodeJS.Timeout = undefined

function mainStateUpdate(updater: (state: MainState) => MainState) {
  clearTimeout(mainStateToDiskTimeout)
  mainState = updater(mainState)
  updateUI()
  mainStateToDiskTimeout = setTimeout(() => {
    writeFile('./main-state.json', JSON.stringify(mainState), () => {})
  }, 500)
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
  const matchingEffect: undefined | keyof typeof effectsSchema = effectTypes.find(
    (effect) => 'quickEffects.' + effect === path
  )
  if (name === 'press' && matchingEffect) {
    mainStateUpdate((state) => ({
      ...state,
      effects: { ...state.effects, [matchingEffect]: Date.now() },
    }))
    return
  }
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
  console.log('Unknown Event', path, name, value)
})

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
