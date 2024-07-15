import '@rise-tools/kit-react-navigation/server'

import { createConnectionQR, getHost, HostType } from '@rise-tools/cli'
import { createHTTPServer } from '@rise-tools/server'

import { models as delivery } from './delivery/ui'
import { models as inventory } from './inventory/ui'
import { models as controls } from './ui-controls/ui'

const models = { ...inventory, ...controls, ...delivery }

async function init() {
  const port = Number(process.env.PORT || '3005')
  const host = await getHost(HostType.tunnel)

  // await createWSServer(models, port)
  await createHTTPServer(models, port)

  const qr = await createConnectionQR({
    host: `${host}:${port}`,
    label: 'Rise Demo',
    id: 'demo',
    path: '/',
  })

  console.log(qr)
}

init()

declare module '@rise-tools/kit-react-navigation/server' {
  type ModelKeys = keyof typeof models

  export interface NavigatePath extends Record<ModelKeys, string> {}
}
