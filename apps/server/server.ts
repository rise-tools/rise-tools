import { readFileSync, writeFile } from 'fs'
import {
  ColorValue,
  Color_Blue,
  Color_Full,
  Color_Green,
  Color_Off,
  Color_Red,
  Position,
  flushUpdates,
  setCanChannels,
  setMovingHeadChannels,
} from './dmx'
import { eg as egInfo } from './eg'
import { egSacnService } from './eg-sacn'
import { createWSServer } from './ws-rnt-server'
import { z } from 'zod'
import { hslToHex } from './color'
import { VideoPlayer, egVideo } from './eg-video-playback'
import { readDb } from './eg-video'
import { stagelinqInterface } from './denon-stagelinq/StageLinkExternal'

function getModeControls(state: MainState) {
  if (state.mode === 'color') {
    return [
      {
        $: 'component',
        key: 'colorPreview',
        component: 'View',
        props: {
          height: 50,
          backgroundColor: hslToHex(state.color.h, state.color.s, state.color.l),
          borderRadius: '$3',
        },
      },
      {
        $: 'component',
        key: 'hueSlider',
        component: 'SliderField',
        props: {
          label: 'Hue',
          value: state.color.h,
          max: 360,
          min: 0,
          step: 1,
        },
      },
      {
        $: 'component',
        key: 'saturationSlider',
        component: 'SliderField',
        props: {
          label: 'Saturation',
          value: state.color.s,
          max: 1,
          min: 0,
          step: 0.01,
        },
      },
      {
        $: 'component',
        key: 'lightnessSlider',
        component: 'SliderField',
        props: {
          label: 'Lightness',
          value: state.color.l,
          max: 1,
          min: 0,
          step: 0.01,
        },
      },
    ] as const
  }
  if (state.mode === 'video') {
    return [
      {
        $: 'component',
        key: 'selectVideo',
        component: 'SelectField',
        props: {
          value: state.video.track,
          options: { $: 'ref', ref: ['videoList'] },
        },
      },
      {
        $: 'component',
        key: 'restart',
        component: 'Button',
        children: 'Restart Video',
      },
    ]
  }
  return [] as const
}

function getUIRoot(state: MainState) {
  return {
    $: 'component',
    component: 'ScrollView',
    props: {
      padding: '$4',
      gap: '$4',
    },
    children: [
      {
        $: 'component',
        key: '1',
        component: 'Paragraph',
        props: {
          children: `Mode: ${state.mode}`,
        },
      },
      {
        $: 'component',
        key: 'mode',
        component: 'SelectField',
        props: {
          value: state.mode,
          options: [
            { key: 'off', label: 'Off' },
            { key: 'white', label: 'White' },
            { key: 'color', label: 'Color' },
            { key: 'rainbow', label: 'Rainbow' },
            { key: 'layers', label: 'Layers' },
            { key: 'video', label: 'Video' },
            // { key: 'simple', label: 'Simple' },
            // { key: 'advanced', label: 'Advanced' },
            // { key: 'beatmatch', label: 'Beatmatch' },
          ],
        },
      },

      {
        $: 'component',
        key: 'offButton',
        component: 'Button',
        children: 'All Off',
        props: {
          disabled: state.mode === 'off',
        },
      },
      ...getModeControls(state),
      // {
      //   $: 'component',
      //   key: 'button',
      //   component: 'Button',
      //   children: {
      //     $: 'component',
      //     component: 'XStack',
      //     key: 'XStack',
      //     props: {
      //       jc: 'space-between',
      //       ai: 'center',
      //       f: 1,
      //     },
      //     children: [
      //       'Quick Effects',
      //       { $: 'component', key: 'lol', component: 'Icon', props: { icon: 'Sparkles' } },
      //     ],
      //   },
      //   props: {
      //     onPress: ['navigate', 'effects'],
      //     // icon: { $: 'component', key: 'lol', component: 'Icon', props: { icon: 'Check' } },
      //   },
      // },

      {
        $: 'component',
        key: 'quickEffects',
        component: 'Button',
        children: 'Quick Effects',
        props: {
          onPress: ['navigate', 'quickEffects'],
          spaceFlex: 1,
          iconAfter: {
            $: 'component',
            key: 'icon',
            component: 'Icon',
            props: { icon: 'Sparkles' },
          },
        },
      },
      {
        $: 'component',
        key: 'beatEffects',
        component: 'Button',
        children: 'Beat Effects',
        props: {
          onPress: ['navigate', 'beatEffects'],
          spaceFlex: 1,
          iconAfter: {
            $: 'component',
            key: 'icon',
            component: 'Icon',
            props: { icon: 'HeartPulse' },
          },
        },
      },
    ],
  }
}

const effectsSchema = {
  flash: z.nullable(z.number()),
  waveIn: z.nullable(z.number()),
  waveOut: z.nullable(z.number()),
} as const

const effectTypes = Object.keys(effectsSchema) as (keyof typeof effectsSchema)[]

const colorSchema = z.object({
  h: z.number(),
  s: z.number(),
  l: z.number(),
})

const MainStateSchema = z.object({
  mode: z.enum(['off', 'white', 'rainbow', 'color', 'layers', 'video']),
  color: colorSchema,
  effects: z.object(effectsSchema),
  beatEffect: z.object({
    effect: z.enum(['flash', 'waveIn', 'waveOut']),
    color: colorSchema,
    intensity: z.number(),
    waveLength: z.number(),
    dropoff: z.number(),
  }),
  layers: z.array(
    z.discriminatedUnion('key', [
      z.object({
        key: z.literal('color'),
        id: z.string(),
      }),
    ])
  ),
  video: z.object({
    track: z.string(),
  }),
  manualBeat: z.object({
    enabled: z.boolean(),
    lastBeatTime: z.number(),
    bpm: z.number(),
  }),
})

type MainState = z.infer<typeof MainStateSchema>

let mainState: MainState = {
  mode: 'off',
  color: {
    h: 0,
    s: 1,
    l: 1,
  },
  effects: {
    flash: null,
    waveIn: null,
    waveOut: null,
  },
  beatEffect: {
    effect: 'waveOut',
    color: {
      h: 0.5,
      s: 1,
      l: 0.5,
    },
    intensity: 50,
    waveLength: 0.5,
    dropoff: 0.1,
  },
  video: {
    track: 'none',
  },
  layers: [],
  manualBeat: {
    enabled: true,
    lastBeatTime: 0,
    bpm: 0,
  },
}

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

type StateContext = {
  time: number
  nowTime: number
  relativeTime: number
}

const canCount = 4

function mainCanRainbow(ctx: StateContext, canIndex: number): ColorValue {
  const { time, relativeTime } = ctx
  const hueRotationRpm = 6
  const hueRotationRps = hueRotationRpm / 60
  const baseHue = (360 / canCount) * canIndex
  const currentHue = (baseHue + (relativeTime / 1000) * hueRotationRps * 360) % 360
  return pureHue(currentHue)
}

function pureHue(hue: number): ColorValue {
  const f = (n: number, k = (n + hue / 60) % 6) => 255 * Math.max(Math.min(k - 3, 3 - k, 1), 0)
  return { red: f(5), green: f(3), blue: f(1), white: 0 }
}

function mainCanLoop(ctx: StateContext, canIndex: number): ColorValue {
  const { time, relativeTime } = ctx
  switch (mainState.mode) {
    case 'off':
    case 'white':
      return mainColor(ctx)
    case 'rainbow':
      return mainCanRainbow(ctx, canIndex)
    default:
      return Color_Off
  }
}

function mainColor(ctx: StateContext): ColorValue {
  const { time, relativeTime } = ctx
  if (mainState.mode === 'white') return Color_Full
  if (mainState.mode === 'off') return Color_Off
  return Color_Off
}

function mainMovingHeadLoop(
  ctx: StateContext,
  movingHeadIndex: number
): readonly [ColorValue, Position] {
  return [mainColor(ctx), { x: 0, y: 0.5 }] as const
}

// Overall topology for installation

// M0                       M1
//          C1 C2 C3
//       C0          C4
//       C5          C9
//          C6 C7 C8
// M2                       M3

// key:
//   C# = Static Can RGB Light
//   M# = Moving Head Light

const canAddressRemapping = new Map<number, number>()
canAddressRemapping.set(0, 0) // map from virtual address 0 to physical address 0
const movingHeadAddressRemapping = new Map<number, number>()
movingHeadAddressRemapping.set(0, 0)

function getCanAddress(virtualIndex: number): number {
  const physicalIndex = canAddressRemapping.get(virtualIndex)
  if (physicalIndex !== undefined) return physicalIndex
  return virtualIndex
}
function getMovingHeadAddress(virtualIndex: number): number {
  const physicalIndex = movingHeadAddressRemapping.get(virtualIndex)
  if (physicalIndex !== undefined) return physicalIndex
  return virtualIndex
}

const canDMXStarts = [1, 17, 25, 33, 41, 49, 57, 65, 73]
const movingHeadDMXStarts = [100, 112, 124, 136]

const eg = egSacnService(egInfo, 3998)
const video = egVideo(egInfo, process.env.EG_MEDIA_PATH || 'eg-media')

const egEffectAppliers: Record<
  keyof typeof effectsSchema,
  (frame: Uint8Array, progress: number, intensity: number, waveLength: number) => Uint8Array
> = {
  flash: eg.applyEGFlash,
  waveIn: eg.waveFrameLayerEffect(true),
  waveOut: eg.waveFrameLayerEffect(false),
}

let stagelinqLastBeatTime = 0
let stagelinqLastMeasureTime = 0
let stagelinqBpm = 0

const effectDuration = 1000
function applyEGEffects(ctx: StateContext, frame: Uint8Array): Uint8Array {
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

const blackFrame = eg.createSolidRGBFrame(0, 0, 0)
const whiteFrame = eg.createSolidRGBFrame(255, 255, 255)

function getEGFrame(ctx: StateContext): Uint8Array {
  const { relativeTime } = ctx
  if (mainState.mode === 'off') return blackFrame
  if (mainState.mode === 'white') {
    return applyEGEffects(ctx, whiteFrame)
  }
  if (mainState.mode === 'color') {
    const frame = eg.createSolidHSLFrame(mainState.color.h, mainState.color.s, mainState.color.l)
    return applyEGEffects(ctx, frame)
  }
  if (mainState.mode === 'rainbow') {
    const startRatio = ~~(relativeTime % 5000) / 5000
    const frame = eg.createRainbowFrame(startRatio)
    return applyEGEffects(ctx, frame)
  }
  if (mainState.mode === 'video') {
    let frame = blackFrame
    if (mainState.video.track !== 'none') {
      const player = getVideoPlayback(mainState.video.track)
      if (player) {
        const videoFrame = player.readFrame()
        if (videoFrame) {
          frame = videoFrame
        }
      }
    }
    return applyEGEffects(ctx, frame)
  }
  return blackFrame
}

function mainLoop() {
  const nowTime = Date.now()
  const relativeTime = nowTime - startTime
  const context = { time: startTime, nowTime, relativeTime }
  canDMXStarts.forEach((start, index) => {
    setCanChannels(start, mainCanLoop(context, getCanAddress(index)))
  })
  movingHeadDMXStarts.forEach((start, index) => {
    setMovingHeadChannels(start, ...mainMovingHeadLoop(context, getMovingHeadAddress(index)))
  })
  flushUpdates()
  wsServer.update('relativeTime', relativeTime)

  let egFrame = getEGFrame(context)
  eg.sendFrame(egFrame)
}

const mainAnimationFPS = 30

setInterval(mainLoop, 1000 / mainAnimationFPS)

const wsServer = createWSServer(3990)

const startTime = Date.now()
wsServer.update('startTime', startTime)

function updateUI() {
  const newMainState = getUIRoot(mainState)
  wsServer.update('mainState', mainState)
  wsServer.updateRoot(newMainState)
  wsServer.update('quickEffects', {
    $: 'component',
    component: 'YStack',
    props: {
      padding: '$4',
      gap: '$4',
    },
    children: [
      { $: 'component', key: 'flash', component: 'Button', children: 'Flash' },
      { $: 'component', key: 'waveIn', component: 'Button', children: 'WaveIn' },
      { $: 'component', key: 'waveOut', component: 'Button', children: 'WaveOut' },
    ],
  })
  wsServer.update('beatEffects', {
    $: 'component',
    component: 'YStack',
    props: {
      gap: '$4',
    },
    children: [
      section(
        'Beat Effect',
        [
          {
            $: 'component',
            key: 'intensity',
            component: 'SliderField',
            props: {
              label: 'Intensity',
              value: { $: 'ref', ref: ['mainState', 'beatEffect', 'intensity'] },
              max: 100,
              min: 0,
              step: 1,
            },
          },
          {
            $: 'component',
            key: 'waveLength',
            component: 'SliderField',
            props: {
              label: 'Wave Length %',
              value: { $: 'ref', ref: ['mainState', 'beatEffect', 'waveLength'] },
              max: 1,
              min: 0,
              step: 0.01,
            },
          },
          {
            $: 'component',
            key: 'dropoff',
            component: 'SliderField',
            props: {
              label: 'DropOff %',
              value: { $: 'ref', ref: ['mainState', 'beatEffect', 'dropoff'] },
              max: 1,
              min: 0,
              step: 0.01,
            },
          },
          {
            $: 'component',
            key: 'effect',
            component: 'SelectField',
            props: {
              value: mainState.beatEffect.effect,
              options: [
                { key: 'flash', label: 'flash' },
                { key: 'waveIn', label: 'waveIn' },
                { key: 'waveOut', label: 'waveOut' },
              ],
            },
          },
        ],
        'effect'
      ),
      section(
        'Manual Beat Pace',
        [
          {
            $: 'component',
            key: 'manualBeatEnabled',
            component: 'SwitchField',
            props: {
              label: 'Enabled',
              value: { $: 'ref', ref: ['mainState', 'manualBeat', 'enabled'] },
            },
          },
          {
            $: 'component',
            key: 'tapBeat',
            component: 'Button',
            children: 'Tap Beat',
            props: {
              onPress: null,
              onPressOut: null,
              onPressIn: 'manualTapBeat',
              spaceFlex: 1,
              iconAfter: icon('Activity'),
            },
          },
        ],
        'manualBeat'
      ),
      section('Denon Stagelinq', [
        { $: 'ref', ref: ['stagelinqConnection'] },
        // simpleLabel('Coming Soon')
      ]),

      // { $: 'component', key: 'waveIn', component: 'Button', children: 'WaveIn' },
      // { $: 'component', key: 'waveOut', component: 'Button', children: 'WaveOut' },
    ],
  })
}
updateUI()

function icon(name: string) {
  return {
    $: 'component',
    key: 'icon',
    component: 'Icon',
    props: { icon: name },
  }
}
function simpleLabel(text: string) {
  return {
    $: 'component',
    key: text,
    component: 'Label',
    children: text,
  }
}
function section(title: string, children: any, key?: string) {
  return {
    $: 'component',
    component: 'YStack',
    key: key || title,
    props: {
      padding: '$4',
      gap: '$2',
    },
    children: [
      {
        $: 'component',
        key: 'title',
        component: 'Label',
        children: title,
        props: {
          fontSize: '$2',
          fontWeight: 'bold',
          color: '$color10',
        },
      },
      ...children,
    ],
  }
}

let mainStateToDiskTimeout: undefined | NodeJS.Timeout = undefined

function mainStateUpdate(updater: (state: MainState) => MainState) {
  clearTimeout(mainStateToDiskTimeout)
  mainState = updater(mainState)
  updateUI()
  // rescheduleBeatUpdates()
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

const readyVideoPlayers: Record<string, undefined | VideoPlayer> = {}

const loadingVideoPlayers: Record<string, undefined | Promise<void>> = {}

function getVideoPlayback(fileId: string) {
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
  // console.log('tap beat', {
  //   manualTapBeatCount,
  //   manualTapBeatStart,
  //   manualTapBeatLastTime,
  // })

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
  if (path === 'restart' && name === 'press') {
    const player = getVideoPlayback(mainState.video.track)
    if (player) {
      player.restart()
    }
    return
  }
  console.log('Unknown Event', path, name, value)
})

function updateMedia() {
  readDb('eg-media').then((media) => {
    wsServer.update('videoList', [
      { key: 'none', label: 'None' },
      ...media.files.map((m) => ({ key: m.fileSha256, label: m.title })),
    ])
  })
}

updateMedia()

setInterval(() => {
  updateMedia()
}, 5000)

stagelinqInterface({
  quiet: true,
  onConnectionStatus: (status) => {
    // console.log('stagelinq connection status', status)
    wsServer.update('stagelinqConnection', status)
  },
  newBeatInfo: (info) => {
    // console.log(info.lastBeatTime)
    // console.log('new beat info', info)
    stagelinqBpm = info.bpm
    stagelinqLastBeatTime = info.lastBeatTime
    stagelinqLastMeasureTime = info.lastMeasureTime
    // info.bpm
  },
})
