import { z } from 'zod'

import { DataStateType } from './template'
const SingleEventDataStateSchema = z.object({
  $: z.literal(DataStateType.Event),
  action: z.string(),
})
export const EventDataStateSchema = z.union([
  SingleEventDataStateSchema,
  z.array(SingleEventDataStateSchema),
])
export type EventDataState = z.infer<typeof SingleEventDataStateSchema>
