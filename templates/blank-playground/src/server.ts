import { createWSServer } from '@rise-tools/server'

import { models } from './models.js'

const port = Number(process.env.PORT || '3005')

createWSServer(models, port)