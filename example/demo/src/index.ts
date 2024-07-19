import { createWSServer } from '@rise-tools/server'

import { models as delivery } from './delivery/ui.js'
import { models as inventory } from './inventory/ui.js'
import { models as controls } from './ui-controls/ui.js'

const models = { ...inventory, ...controls, ...delivery }

const port = Number(process.env.PORT || '3005')

createWSServer(models, port)

import '@rise-tools/kit-react-navigation/server'
declare module '@rise-tools/kit-react-navigation/server' {
  interface Navigate {
    path: keyof typeof models
  }
}
