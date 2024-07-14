import z from 'zod'

export const argsSchema = z.object({
  prod: z.boolean().optional().default(false),
  port: z.number(),
  host: z.enum(['localhost', 'lan', 'tunnel']).default('lan'),
  root: z.string(),
})
