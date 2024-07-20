import { createWSServer, InferModel } from '@rise-tools/server'

import { models as delivery } from './delivery/ui'
import { models as inventory } from './inventory/ui'
import { models as controls } from './ui-controls/ui'

const models = { ...inventory, ...controls, ...delivery }

const port = Number(process.env.PORT || '3005')

createWSServer(models, port)

import '@rise-tools/kit-react-navigation/server'

declare module '@rise-tools/kit-react-navigation/server' {
  interface Navigate {
    screens: InferModel<typeof models>
  }
}
