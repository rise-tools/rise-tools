export function assertEvery<T>(arr: T[], fn: (item: T) => boolean): boolean {
  for (const item of arr) {
    if (!fn(item)) {
      throw new Error('All items in an array must be of the same type.')
    }
  }
  return true
}
