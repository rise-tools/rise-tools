import exp from 'constants'
import { z } from 'zod'

import { EGVideo } from './eg-video-playback'

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
  key: z.string(),
  type: z.literal('desaturate'),
  value: z.number(),
})
export type DesaturateEffect = z.infer<typeof desaturateEffectSchema>

const colorizeEffectSchema = z.object({
  key: z.string(),
  type: z.literal('colorize'),
  amount: z.number(),
  saturation: z.number(),
  hue: z.number(),
})
export type ColorizeEffect = z.infer<typeof colorizeEffectSchema>

const brightenEffectSchema = z.object({
  key: z.string(),
  type: z.literal('brighten'),
  value: z.number(),
})
export type BrightenEffect = z.infer<typeof brightenEffectSchema>

const darkenEffectSchema = z.object({
  key: z.string(),
  type: z.literal('darken'),
  value: z.number(),
})
export type DarkenEffect = z.infer<typeof darkenEffectSchema>

const hueShiftEffectSchema = z.object({
  key: z.string(),
  type: z.literal('hueShift'),
  value: z.number(), // range from -180 to 180
})
export type HueShiftEffect = z.infer<typeof hueShiftEffectSchema>

const rotateEffectSchema = z.object({
  key: z.string(),
  type: z.literal('rotate'),
  value: z.number(), // range from 0-1
})
export type RotateEffect = z.infer<typeof rotateEffectSchema>

const invertEffectSchema = z.object({
  key: z.string(),
  type: z.literal('invert'),
})
export type InvertEffect = z.infer<typeof invertEffectSchema>

const effectSchema = z.discriminatedUnion('type', [
  desaturateEffectSchema,
  colorizeEffectSchema,
  invertEffectSchema,
  hueShiftEffectSchema,
  brightenEffectSchema,
  darkenEffectSchema,
  rotateEffectSchema,
])
export type Effect = z.infer<typeof effectSchema>

const effectsSchema = z.array(effectSchema)
export type Effects = z.infer<typeof effectsSchema>

const videoParamsSchema = z.object({
  loopBounce: z.boolean().optional(),
  reverse: z.boolean().optional(),
})
export type VideoParams = z.infer<typeof videoParamsSchema>

const videoMediaSchema = z.object({
  id: z.string(),
  type: z.literal('video'),
  track: z.string().nullable(),
  effects: effectsSchema.optional(),
  params: videoParamsSchema.optional(),
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

export type Layer = {
  key: string
  media: Media
  name?: string

  blendMode: 'add' | 'mix' | 'mask'
  blendAmount: number
}

const layerSchema: z.ZodType<Layer> = z.object({
  key: z.string(),
  media: z.lazy(() => mediaSchema),
  blendMode: z.enum(['add', 'mix', 'mask']),
  blendAmount: z.number(),
})

export type LayersMedia = {
  type: 'layers'
  layers: Layer[]
}
const layersMediaSchema: z.ZodType<LayersMedia> = z.object({
  type: z.literal('layers'),
  layers: z.array(layerSchema),
})

export type SequenceMedia = {
  type: 'sequence'
  sequence: {
    key: string
    media: Media
  }[]
}
const sequenceMediaSchema: z.ZodType<SequenceMedia> = z.object({
  type: z.literal('sequence'),
  sequence: z.array(
    z.object({
      key: z.string(),
      media: z.lazy(() => mediaSchema),
    })
  ),
})

export type Media = OffMedia | ColorMedia | VideoMedia | LayersMedia | SequenceMedia

const mediaSchema: z.ZodType<Media> = z.discriminatedUnion('type', [
  offMediaSchema,
  colorMediaSchema,
  videoMediaSchema,
  layersMediaSchema,
  sequenceMediaSchema,
])

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
