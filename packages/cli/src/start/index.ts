import { argsSchema } from './argsSchema'
import { createDevServer } from './server'

export const startAction = async (opts: any) => {
  const args = argsSchema.parse(opts)

  const { start } = createDevServer(args)

  const cleanup = await start()

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
  process.on('exit', cleanup)
}
