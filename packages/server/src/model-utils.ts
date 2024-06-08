import { AnyModels, ValueModel } from './types'

export function findModel<V>(models: AnyModels, path: string[]): undefined | ValueModel<V> {
  let walkModel: AnyModels | undefined = models
  path.forEach((term) => {
    if (!walkModel) return
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
  })
  while (walkModel?.type === 'lookup') {
    walkModel = walkModel.get('')
  }
  if (walkModel?.type === 'state' || walkModel?.type === 'query' || walkModel?.type === 'view')
    return walkModel
  return undefined
}