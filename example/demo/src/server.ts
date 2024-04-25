import { createWSServer } from '@final-ui/ws-server'

import { getInventoryExample } from './inventory/ui'

const server = createWSServer(3005)

for (const [key, value] of Object.entries(getInventoryExample())) {
  server.update(key, value)
}
