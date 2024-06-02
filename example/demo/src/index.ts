import { createWSServer } from '@final-ui/server'

import { models } from './inventory/ui'

createWSServer(models, Number(process.env.PORT || '3005'))
