import { describe, expectTypeOf, test } from 'vitest'

import { lookup } from '../model-lookup'
import { view } from '../model-view'
import type { InferModel } from '../types'

describe('types', () => {
  test('infer navigation types from models', () => {
    const models = {
      foo: () => null,
      bar: view(() => null),
    }
    expectTypeOf<InferModel<typeof models>>().toMatchTypeOf<'foo' | 'bar'>()
  })
  test('infer navigation types from lookup models', () => {
    const models = {
      plain: lookup(() => view(() => null)),
      nested: lookup(() => lookup(() => view(() => null))),
    }
    expectTypeOf<InferModel<typeof models>>().toMatchTypeOf<
      `plain/${string}` | `nested/${string}/${string}`
    >()
  })
})
