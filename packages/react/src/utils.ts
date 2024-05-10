export function assertAll<T>(arr: T[], fn: (item: T) => boolean): boolean {
  if (arr.length === 0) {
    // as per Array.prototype.every
    return true
  }
  const firstItemResult: boolean = fn(arr[0] as T)
  for (const item of arr) {
    if (firstItemResult !== fn(item)) {
      throw new Error('All items in an array must be of the same type.')
    }
  }
  return firstItemResult
}
