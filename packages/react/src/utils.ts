export function assertEvery<T>(arr: T[], fn: (item: T) => boolean): boolean {
  const firstItemResult: boolean = fn(arr[0] as T)
  for (const item of arr) {
    if (firstItemResult !== fn(item)) {
      throw new Error('All items in an array must be of the same type.')
    }
  }
  return true
}
