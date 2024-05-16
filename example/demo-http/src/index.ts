import { DurableObject } from 'cloudflare:workers'

export interface Env {
  STORAGE: DurableObjectNamespace<InMemoryStorage>
}

export default {
  async fetch(request, env) {
    // tbd: we should make this unique for each user
    const dataState = env.STORAGE.get(env.STORAGE.idFromName('global-state'))
    return new Response(await dataState.get())
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
