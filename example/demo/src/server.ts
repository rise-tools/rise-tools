import { createWSServer } from '@final-ui/ws-server'

import { getInventoryExample } from './inventory/ui'
import { UIContext } from './types'

const server = createWSServer(3005)

const ctx: UIContext = {
	update: (key, updater) => {
		server.update(key, updater(server.get(key)))
	},
}

for (const [key, value] of Object.entries(getInventoryExample(ctx))) {
	server.update(key, value)
}
