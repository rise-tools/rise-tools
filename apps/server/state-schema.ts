import { z } from 'zod'
import { EGVideo } from './eg-video-playback'
import exp from 'constants'

export type StateContext = {
  time: number
  nowTime: number
  relativeTime: number
  video: EGVideo
}

// export const effectsSchema = {
//   flash: z.nullable(z.number()),
//   waveIn: z.nullable(z.number()),
//   waveOut: z.nullable(z.number()),
// } as const

// export const effectTypes = Object.keys(effectsSchema) as (keyof typeof effectsSchema)[]

const colorSchema = z.object({
  h: z.number(),
  s: z.number(),
  l: z.number(),
})

const desaturateEffectSchema = z.object({
  key: z.literal('desaturate'),
  value: z.number(),
})
export type DesaturateEffect = z.infer<typeof desaturateEffectSchema>

const hueShiftEffectSchema = z.object({
  key: z.literal('hueShift'),
  value: z.number(),
})
export type HueShiftEffect = z.infer<typeof hueShiftEffectSchema>

const effectSchema = z.discriminatedUnion('key', [desaturateEffectSchema, hueShiftEffectSchema])
export type Effect = z.infer<typeof effectSchema>

const effectsSchema = z.array(effectSchema)
export type Effects = z.infer<typeof effectsSchema>

const videoMediaSchema = z.object({
  id: z.string(),
  type: z.literal('video'),
  track: z.string().nullable(),
  effects: effectsSchema.optional(),
})
export type VideoMedia = z.infer<typeof videoMediaSchema>

const colorMediaSchema = z.object({
  type: z.literal('color'),
  h: z.number(),
  s: z.number(),
  l: z.number(),
})
export type ColorMedia = z.infer<typeof colorMediaSchema>

const offMediaSchema = z.object({
  type: z.literal('off'),
})
export type OffMedia = z.infer<typeof offMediaSchema>

const mediaSchema = z.discriminatedUnion('type', [
  offMediaSchema,
  colorMediaSchema,
  videoMediaSchema,
])
export type Media = z.infer<typeof mediaSchema>

const fadeTransitionSchema = z.object({
  type: z.literal('fade'),
  mode: z.enum(['add', 'mix']),
  duration: z.number(),
})
export type FadeTransition = z.infer<typeof fadeTransitionSchema>

const maskTransitionSchema = z.object({
  type: z.literal('mask'),
  mode: z.enum(['add', 'mix']),
  duration: z.number(),
})
export type MaskTransition = z.infer<typeof maskTransitionSchema>

const transitionSchema = z.discriminatedUnion('type', [fadeTransitionSchema, maskTransitionSchema])
export type Transition = z.infer<typeof transitionSchema>

const transitionStateSchema = z.object({
  manual: z.number().nullable(),
  autoStartTime: z.number().nullable(),
})
export type TransitionState = z.infer<typeof transitionStateSchema>

export const MainStateSchema = z.object({
  // OLD SHIT
  mode: z.enum(['off', 'white', 'rainbow', 'color', 'layers', 'video']),
  color: colorSchema,
  effects: z.object({}),
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

  // NEW SCHEMA

  liveMedia: mediaSchema,
  readyMedia: mediaSchema,
  transition: transitionSchema,
  transitionState: transitionStateSchema,
})

export type MainState = z.infer<typeof MainStateSchema>

export const defaultMainState: MainState = {
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

  // NEW STUFF
  liveMedia: {
    type: 'off',
  },
  readyMedia: {
    type: 'off',
  },
  transition: {
    type: 'fade',
    mode: 'mix',
    duration: 1000,
  },
  transitionState: {
    manual: null,
    autoStartTime: null,
  },
}
