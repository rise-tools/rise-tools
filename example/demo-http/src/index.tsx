import { createHTTPDataSource } from '@final-ui/http-server'
import { Text, View } from '@final-ui/tamagui/server'
import { DurableObject } from 'cloudflare:workers'

export interface Env {
  STORAGE: DurableObjectNamespace<InMemoryStorage>
}

const httpDataSource = createHTTPDataSource()

httpDataSource.update(
  'user',
  <View>
    <Text>User</Text>
  </View>
)

// this either needs to receive a function or need a model with some context to be able
// to access cloudflare durable object or any other storage from context
httpDataSource.updateRoot(
  <View>
    <Text>Current value</Text>
  </View>
)

export default {
  async fetch(request) {
    // tbd: we should make this unique for each user
    // tbd: use permanent storage in the example
    // const dataState = env.STORAGE.get(env.STORAGE.idFromName('global-state'))
    return httpDataSource.handleRequest(request)
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
