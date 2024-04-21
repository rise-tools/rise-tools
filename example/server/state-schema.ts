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
  label: z.string().optional(),
  type: z.literal('video'),
  track: z.string().nullable(),
  effects: effectsSchema.optional(),
  params: videoParamsSchema.optional(),
})
export type VideoMedia = z.infer<typeof videoMediaSchema>

const colorMediaSchema = z.object({
  type: z.literal('color'),
  label: z.string().optional(),
  h: z.number(),
  s: z.number(),
  l: z.number(),
})
export type ColorMedia = z.infer<typeof colorMediaSchema>

const offMediaSchema = z.object({
  type: z.literal('off'),
  label: z.string().optional(),
})
export type OffMedia = z.infer<typeof offMediaSchema>

export type Layer = {
  key: string
  media: Media
  blendMode: 'add' | 'mix' | 'mask'
  blendAmount: number
}

const layerSchema: z.ZodType<Layer> = z.object({
  key: z.string(),
  label: z.string().optional(),
  media: z.lazy(() => mediaSchema),
  blendMode: z.enum(['add', 'mix', 'mask']),
  blendAmount: z.number(),
})

export type LayersMedia = {
  type: 'layers'
  label?: string
  layers: Layer[]
}
const layersMediaSchema: z.ZodType<LayersMedia> = z.object({
  type: z.literal('layers'),
  label: z.string().optional(),
  layers: z.array(layerSchema),
})

const sequenceItemSchema = z.object({
  key: z.string(),
  maxDuration: z.number().nullable().optional(),
  goOnVideoEnd: z.boolean().optional(),
  media: z.lazy(() => mediaSchema),
})
export type SequenceItem = {
  key: string
  maxDuration?: null | number
  goOnVideoEnd: undefined | boolean
  media: Media
}

export type SequenceMedia = {
  type: 'sequence'
  label?: string
  activeKey?: string | undefined
  lastTransitionTime?: number | undefined
  sequence: SequenceItem[]
}
const sequenceMediaSchema: z.ZodType<SequenceMedia> = z.object({
  type: z.literal('sequence'),
  label: z.string().optional(),
  activeKey: z.string().optional(),
  lastTransitionTime: z.number().optional(),
  sequence: z.array(sequenceItemSchema),
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
  liveMedia: mediaSchema,
  readyMedia: mediaSchema,
  transition: transitionSchema,
  transitionState: transitionStateSchema,
})

export type MainState = z.infer<typeof MainStateSchema>

export const defaultMainState: MainState = {
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
