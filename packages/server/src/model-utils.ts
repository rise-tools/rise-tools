import { AnyModels, ValueModel } from './types.js'

export function findModel<V>(
  models: AnyModels,
  path: string[]
): ValueModel<V> | (() => V) | undefined {
  let walkModel: AnyModels | undefined = models
  for (const term of path) {
    if (!walkModel) return
    if (typeof walkModel === 'function') {
      return
    }
    if (walkModel.type === 'lookup') {
      walkModel = walkModel.get(term)
    } else if (walkModel.type === 'state') {
      // cannot look up an item in a state. maybe drill into the value here?
      walkModel = undefined
    } else if (walkModel.type === 'query') {
      // cannot look up an item in a query. maybe drill into the value here?
      walkModel = undefined
    } else if (walkModel.type === 'view') {
      // cannot look up an item in a view. maybe drill into the value here?
      walkModel = undefined
    } else {
      walkModel = walkModel[term]
    }
  }
  while (walkModel && typeof walkModel !== 'function' && walkModel?.type === 'lookup') {
    walkModel = walkModel.get('')
  }
  if (
    typeof walkModel === 'function' ||
    walkModel?.type === 'state' ||
    walkModel?.type === 'query' ||
    walkModel?.type === 'view'
  )
    return walkModel
  return undefined
}

export function getModelState<V>(model: ValueModel<V> | (() => V)) {
  if (typeof model === 'function') {
    return model()
  }
  return model.get()
}
