import { DataState } from './template'

export function lookupValue(value: DataState, ref: (string | number)[]) {
  if (ref.length === 0) {
    return value
  }
  if (typeof value !== 'object') {
    throw new Error('Cannot lookup path on non-object')
  }

  const [refKey, ...lookupKeys] = ref

  // @ts-ignore
  let lookupValue = value?.[refKey]
  for (const key of lookupKeys) {
    if (!lookupValue || typeof lookupValue !== 'object') {
      return undefined
    }
    // @ts-ignore
    lookupValue = lookupValue[key]
  }
  return lookupValue
}
