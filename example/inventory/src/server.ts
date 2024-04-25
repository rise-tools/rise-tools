import { createWSServer } from '@final-ui/ws-server'

import { getAllScreens } from './ui'

const server = createWSServer(3005)

for (const [key, value] of Object.entries(getAllScreens())) {
  server.update(key, value)
}
