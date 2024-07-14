import z from 'zod'

import { argsSchema } from './argsSchema'

export interface IndexedModels {
  [key: string]: any
}

export type CLIArgs = z.infer<typeof argsSchema>
