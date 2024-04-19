import { z } from 'zod'

const SingleEventDataStateSchema = z.object({
  $: z.literal('event'),
  action: z.any(),
})
export const EventDataStateSchema = z.union([
  SingleEventDataStateSchema,
  z.array(SingleEventDataStateSchema),
])
export type EventDataState = z.infer<typeof SingleEventDataStateSchema>
