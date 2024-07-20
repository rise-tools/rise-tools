import { AnyModels, LookupModel } from './types'

export function lookup<T extends AnyModels>(load: (key: string) => T | undefined): LookupModel<T> {
  const cache: Record<string, T | undefined> = {}
  function get(key: string): T | undefined {
    if (cache[key]) return cache[key]
    cache[key] = load(key)
    return cache[key]
  }
  return {
    type: 'lookup',
    get,
  }
}
