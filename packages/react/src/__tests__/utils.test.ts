import { assertEveryOrNone } from '../utils'

it('should return true if items are of the same type', () => {
  expect(assertEveryOrNone([], (item) => typeof item === 'object')).toBe(true)
  expect(assertEveryOrNone([1, 2, 3], (item: number) => typeof item === 'number')).toBe(true)
  expect(assertEveryOrNone([{ $: 'event' }, { $: 'event' }], (item) => item.$ === 'event')).toBe(
    true
  )
  expect(assertEveryOrNone([{ $: 'event' }, { $: 'event' }], (item) => item.$ === 'action')).toBe(
    false
  )
})

it('should throw if items are different', () => {
  expect(() =>
    assertEveryOrNone(
      [{ $: 'event' }, { $: 'action' }, { $: 'event' }],
      (item) => item.$ === 'event'
    )
  ).toThrowError()
  expect(() =>
    assertEveryOrNone(
      [{ $: 'event' }, { $: 'action' }, { $: 'event' }],
      (item) => item.$ === 'action'
    )
  ).toThrowError()
})
