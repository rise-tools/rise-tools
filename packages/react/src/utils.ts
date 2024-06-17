export function lookupValue(value: unknown, ref: (string | number)[]) {
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
    if (Array.isArray(lookupValue) && typeof key === 'string') {
      lookupValue = lookupValue.find((item) => item.key === key)
    } else {
      lookupValue = lookupValue[key]
    }
  }
  return lookupValue
}

export type MaybeAsync<T> = Promise<T> | T

// Utility type to convert a union to an intersection
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never
