import {
  _debugNextCreatedModelLabel,
  _setDebugNextModelLabel,
  _setEnableDebug,
  createModel,
} from '../models'

describe.only('basic models', () => {
  test('getter + setter', async () => {
    _setEnableDebug(true)

    const model = await createModel(() => 'foo' as string)
    expect(await model.get()).toBe('foo')
    console.log('did get')
    await model.set('bar')
    console.log('did set')
    expect(await model.get()).toBe('bar')
  })

  test('invalidate re-calls initializer', async () => {
    const initializer = jest.fn()
    initializer.mockReturnValueOnce('a')
    const model = await createModel(initializer)
    expect(await model.get()).toBe('a')
    expect(initializer).toBeCalledTimes(1)
    initializer.mockReturnValueOnce('b')
    model.invalidate()
    expect(await model.get()).toBe('b')
    expect(initializer).toBeCalledTimes(2)
  })

  test('basic subscription', async () => {
    const model = await createModel('a')
    const onUpdate = jest.fn()
    model.subscribe(onUpdate)
    _setEnableDebug(true)
    await model.set('b')
    expect(onUpdate).toBeCalledTimes(1)
    expect(onUpdate).toBeCalledWith('b')
  })
})

describe('derived models', () => {
  test.only('basic dervied value', async () => {
    _setEnableDebug(true)
    _setDebugNextModelLabel('a')
    const a = await createModel(2)
    _setDebugNextModelLabel('b')
    const b = await createModel(3)
    _setDebugNextModelLabel('mult')
    const mult = await createModel(async () => (await a.get()) * (await b.get()))
    expect(await mult.get()).toBe(6)
    await a.set(3)
    expect(await mult.get()).toBe(9)
  })

  test.only('double dervied value', async () => {
    _setDebugNextModelLabel('a')
    const a = await createModel(2)
    _setDebugNextModelLabel('b')
    const b = await createModel(3)
    _setDebugNextModelLabel('mult')
    const mult = await createModel(async () => (await a.get()) * (await b.get()))
    _setDebugNextModelLabel('label')
    const label = await createModel(async () => `a*b=${await mult.get()}`)
    // expect(await label.get()).toBe('a*b=6')
    await a.set(3)
    // expect(await mult.get()).toBe(9)
    _setEnableDebug(true)
    expect(await label.get()).toBe('a*b=9')
  })

  test.only('basic subscribe to derived value', async () => {
    const a = await createModel(2)
    const b = await createModel(3)
    const mult = await createModel(async () => (await a.get()) * (await b.get()))
    const onMult = jest.fn()
    mult.subscribe(onMult)
    _setEnableDebug(true)
    await a.set(3)
    // await new Promise((resolve) => setTimeout(resolve, 1))
    expect(onMult).toBeCalledTimes(1)
    expect(onMult).toBeCalledWith(9)
  })

  test.only('subscribe double derived value', async () => {
    const a = await createModel(2)
    const b = await createModel(3)
    const mult = await createModel(async () => (await a.get()) * (await b.get()))
    const label = await createModel(async () => `a*b=${await mult.get()}`)
    const onLabel = jest.fn()
    label.subscribe(onLabel)
    await a.set(3)
    await new Promise((resolve) => setTimeout(resolve, 10))
    // expect(label.get()).toBe('a*b=9')
    expect(onLabel).toBeCalledTimes(1)
    expect(onLabel).toBeCalledWith('a*b=9')
  })
})
