import { QueryModel } from './types'

export function query<V>(load: () => Promise<V>): QueryModel<V> {
  return {
    type: 'query',
  }
}
