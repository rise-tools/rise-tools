import '@rise-tools/kit-react-navigation/server'

import { createConnectionQR, getHost, HostType } from '@rise-tools/cli'
import { createWSServer } from '@rise-tools/server'

import { models as delivery } from './delivery/ui'
import { models as inventory } from './inventory/ui'
import { models as controls } from './ui-controls/ui'

const host = getHost(HostType.tunnel)
const port = Number(process.env.PORT || '3005')

const models = { ...inventory, ...controls, ...delivery }

createWSServer(models, port)

createConnectionQR({ host: `${host}:${port}`, label: 'Rise Demo', id: 'demo', path: '/' })

// createHTTPServer(models, port)

declare module '@rise-tools/kit-react-navigation/server' {
  type ModelKeys = keyof typeof models

  export interface NavigatePath extends Record<ModelKeys, string> {}
}
