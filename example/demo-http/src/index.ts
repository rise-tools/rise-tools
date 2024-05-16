import { createHTTPDataSource } from '@final-ui/http-server'
import { DurableObject } from 'cloudflare:workers'

import { UIContext } from './types'
import { Example } from './ui'

export interface Env {
  STORAGE: DurableObjectNamespace<InMemoryStorage>
}

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
    // const dataState = env.STORAGE.get(env.STORAGE.idFromName('global-state'))
    return setupDataSource().handleRequest(request)
  },
} satisfies ExportedHandler<Env>

export class InMemoryStorage extends DurableObject {
  async get() {
    const value = (await this.ctx.storage.get('value')) || 0
    return value
  }

  async set(value: string) {
    await this.ctx.storage.put('value', value)
    return value
  }
}
