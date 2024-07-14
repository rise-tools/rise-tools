import z from 'zod'

export const argsSchema = z.object({
  prod: z.boolean().optional().default(false).describe('Start in production mode'),
  root: z.string().describe('Root directory of project').default(process.cwd()),
  port: z.number().describe('Port for server').default(3500),
  host: z
    .enum(['localhost', 'lan', 'tunnel'])
    .describe('Server host type; can be localhost, lan, tunnel')
    .default('lan'),
})
