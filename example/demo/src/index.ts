import { createWSServer } from '@final-ui/server'

import { models as inventory } from './inventory/ui'
import { models as controls } from './ui-controls/ui'

createWSServer({...inventory, ...controls}, Number(process.env.PORT || '3005'))
