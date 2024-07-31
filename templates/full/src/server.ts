import { setupRiseTools } from '@rise-tools/cli'
import { createWSServer, InferModel } from '@rise-tools/server'

// create-rise-import-start
import { models as controls } from './controls/ui'
import { models as delivery } from './delivery/ui'
import { Home } from './home/ui'
import { models as inventory } from './inventory/ui'

const models = { ...inventory, ...controls, ...delivery, '': Home }
// create-rise-import-end

const port = Number(process.env.PORT || '3005')

const server = createWSServer(models, port)

if (process.env.NODE_ENV === 'development') {
  setupRiseTools({ server, projectKey: process.env.RISE_PROJECT_KEY })
}

import '@rise-tools/kit-react-navigation/server'

declare module '@rise-tools/kit-react-navigation/server' {
  interface Navigate {
    screens: InferModel<typeof models>
  }
}
