import fetch from 'node-fetch/lib/index'

import { createModel } from '../models'
import { createServer } from '../server'

describe.skip('model server', () => {
  test('basic model http server', async () => {
    const a = createModel(2)
    const b = createModel(3)
    const mult = createModel(() => a.get() * b.get())
    const label = createModel(() => `a*b=${mult.get()}`)
    const server = createServer({ b, mult, label }, 4002)
    fetch
  })
})
