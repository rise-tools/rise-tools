import { createHTTPDataSource } from '@final-ui/http-server'

import { UIContext } from './types'
import { Example } from './ui'

function setupDataSource() {
  const dataSource = createHTTPDataSource()

  const ctx: UIContext = {
    update: (key, updater) => {
      dataSource.update(key, updater(dataSource.get(key)))
    },
  }

  for (const [key, value] of Object.entries(Example(ctx))) {
    dataSource.update(key, value)
  }

  return dataSource
}
export default {
  async fetch(request) {
    // tbd: we should make this unique for each user
    // tbd: use permanent storage in the example
    // env.STORAGE.get(env.STORAGE.idFromName('global-state'))
    const ds = setupDataSource()
    // userModel

    const userModel = model('', () => kadas.get())
    return ds.handleRequest(request)
  },
} satisfies ExportedHandler
