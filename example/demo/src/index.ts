import '@rise-tools/kit-react-navigation/server'

import { createServer } from '@rise-tools/cli'

import { models as delivery } from './delivery/ui'
import { models as inventory } from './inventory/ui'
import { models as controls } from './ui-controls/ui'

const models = { ...inventory, ...controls, ...delivery }


const port = Number(process.env.PORT || '3005')

createServer(models, {
      port,
    // ws: true,
}).then((server) => {
    console.log(server.appConnectionURL)
    server.printQR()
})


declare module '@rise-tools/kit-react-navigation/server' {
  type ModelKeys = keyof typeof models

  export interface NavigatePath extends Record<ModelKeys, string> {}
}
