import { setupRiseTools } from '@rise-tools/cli'
import { createWSServer } from '@rise-tools/server'

import { models } from './models'

const port = Number(process.env.PORT || '3005')

const server = createWSServer(models, port)

if (process.env.NODE_ENV === 'development') {
  setupRiseTools({ server })
}
