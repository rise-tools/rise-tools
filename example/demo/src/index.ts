import { createWSServer } from '@final-ui/ws-server'

import { InventoryExample } from './inventory/ui'
import { UIContext } from './types'
import { UIControlsExample } from './ui-controls/ui'

const dataSource = createWSServer(Number(process.env.PORT || '3005'))
const ctx: UIContext = {
  update: async (key, updater) => {
    dataSource.update(key, updater(await dataSource.get(key)))
  },
}
for (const [key, value] of [
  ...Object.entries(InventoryExample(ctx)),
  ...Object.entries(UIControlsExample(ctx)),
]) {
  dataSource.update(key, value)
}
