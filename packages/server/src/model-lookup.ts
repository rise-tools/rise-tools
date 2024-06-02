import { LookupModel } from './types'

export function lookup<T>(load: (key: string) => T): LookupModel<T> {
  const cache: Record<string, T> = {}
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
