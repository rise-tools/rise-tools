import { createHTTPServer, createWSServer } from '@rise-tools/server'

import { models as delivery } from './delivery/ui'
import { models as inventory } from './inventory/ui'
import { models as controls } from './ui-controls/ui'

createWSServer({ ...inventory, ...controls, ...delivery }, Number(process.env.PORT || '3005'))

createHTTPServer({ ...inventory, ...controls, ...delivery }, Number(process.env.PORT || '3004'))
