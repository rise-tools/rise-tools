import { z } from 'zod'
import { EGVideo } from './eg-video-playback'

export type StateContext = {
  time: number
  nowTime: number
  relativeTime: number
  video: EGVideo
}

export const effectsSchema = {
  flash: z.nullable(z.number()),
  waveIn: z.nullable(z.number()),
  waveOut: z.nullable(z.number()),
} as const

export const effectTypes = Object.keys(effectsSchema) as (keyof typeof effectsSchema)[]

const colorSchema = z.object({
  h: z.number(),
  s: z.number(),
  l: z.number(),
})

export const MainStateSchema = z.object({
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
}
