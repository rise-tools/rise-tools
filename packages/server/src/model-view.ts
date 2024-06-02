import { ViewModel } from './types'

export function view<T>(load: () => T): ViewModel<T> {
  function get(): T {
    return load()
  }
  //   return getter()
  return {
    type: 'view',
    get,
  }
}
