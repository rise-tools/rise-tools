import { Text, View } from '@final-ui/tamagui/server'
import { DurableObject } from 'cloudflare:workers'

export interface Env {
  STORAGE: DurableObjectNamespace<InMemoryStorage>
}

export default {
  async fetch(request, env) {
    // tbd: we should make this unique for each user
    const dataState = env.STORAGE.get(env.STORAGE.idFromName('global-state'))
    const url = new URL(request.url)
    switch (url.pathname) {
      case '/user': {
        return new Response(
          JSON.stringify(
            <View>
              <Text>User</Text>
            </View>
          )
        )
      }
      default: {
        return new Response(
          JSON.stringify(
            <View>
              <Text>Current value: {await dataState.get()}</Text>
            </View>
          )
        )
      }
    }
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
