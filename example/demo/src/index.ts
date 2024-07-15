import { createConnectionQR, getHost, HostType } from '@rise-tools/cli'
import { createWSServer } from '@rise-tools/server'

import { models as delivery } from './delivery/ui'
import { models as inventory } from './inventory/ui'
import { models as controls } from './ui-controls/ui'

const host = getHost(HostType.tunnel)
const port = Number(process.env.PORT || '3005')

createWSServer({ ...inventory, ...controls, ...delivery }, port)

createConnectionQR({ host: `${host}:${port}`, label: 'Rise Demo', id: 'demo', path: '/' })

// createHTTPServer({ ...inventory, ...controls, ...delivery }, Number(process.env.PORT || '3004'))
