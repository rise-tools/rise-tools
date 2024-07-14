import z from 'zod'

import { argsSchema } from './argsSchema'

export interface IndexedModels {
  [key: string]: any
}

export type DevArgs = z.infer<typeof argsSchema>
