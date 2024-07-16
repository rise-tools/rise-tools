import '@rise-tools/kit-react-navigation/server'

import { createServer } from '@rise-tools/cli'

import { models } from './models'

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
