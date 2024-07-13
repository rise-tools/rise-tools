import { devArgsSchema, DevServer } from './server'

export const devAction = async (opts: any) => {
  const args = devArgsSchema.safeParse(opts)
  if (!args.data) return console.log('Invalid arguments')

  args.data.cwd = process.cwd()
  new DevServer(args.data)
}
