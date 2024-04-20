export function update(source: Record<string, any>, dest: Record<string, any>) {
  const newObj: Record<string, any> = {}

  for (const [key, value] of Object.entries(source)) {
    // If value is an object, e.g. { a: 1, b: 2 }
    if (value && typeof value === 'object') {
      const ref = update(value, dest[key])
      if (value !== ref) {
        newObj[key] = ref
      }
      continue
    }
    // For primitive values, just compare them and overwrite if different
    if (value !== dest[key]) {
      newObj[key] = dest[key]
    }
  }
  // If any of the properties are different, return a new object
  if (Object.keys(newObj).length > 0) {
    return { ...source, ...newObj }
  }
  // Reuse it otherwise
  return source
}
