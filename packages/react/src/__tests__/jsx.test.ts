import { createComponentDefinition, jsx } from '../jsx'
import { isComponentModelState, isEventModelState } from '../rise'

const DummyComponent = createComponentDefinition('DummyComponent')

it('should create ComponentModelState', () => {
  const el = jsx(DummyComponent, { children: null })
  expect(isComponentModelState(el)).toBe(true)
})

it('should compose higher-order functions together', () => {
  const Screen = () => jsx(DummyComponent, { children: null })
  const el = jsx(Screen, { children: null })
  expect(isComponentModelState(el)).toBe(true)
})

it('should handle fragments', () => {
  const el = jsx(undefined, { children: ['foo', 'bar'] })
  expect(el).toMatchInlineSnapshot(`
    Object {
      "$": "component",
      "children": Array [
        "foo",
        "bar",
      ],
      "component": "Fragment",
    }
  `)
})

it('should turn function into event', () => {
  const el = jsx(DummyComponent, {
    onPress: jest.fn(),
    children: null,
  })
  expect(isEventModelState(el.props!.onPress)).toBe(true)
})
