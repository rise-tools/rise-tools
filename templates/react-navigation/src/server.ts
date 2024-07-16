import { createServer } from '@rise-tools/server'

import { models } from './models'

const port = Number(process.env.PORT || '3005')

createServer(models, port)
