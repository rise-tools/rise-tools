import { AnyModel, AnyModels, ViewModel } from './types'

export function view<T>(load: (get: (model: AnyModel) => any) => T): ViewModel<T> {
  function get(): T {
    function getter(model: AnyModel) {}
    return load(getter)
  }
  //   return getter()
  return {
    type: 'view',
    get,
  }
}
