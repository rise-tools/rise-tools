import { z } from 'zod'

const SingleEventDataStateSchema = z.object({
  $: z.literal('event'),
  action: z.string().optional(),
})
export const EventDataStateSchema = z.union([
  SingleEventDataStateSchema,
  z.array(SingleEventDataStateSchema),
])
export type EventDataState = z.infer<typeof SingleEventDataStateSchema>
