import { action } from '../events'
import { createComponentDefinition, jsx } from '../jsx'

const DummyComponent = createComponentDefinition('DummyComponent')

it('should turn function into event', () => {
  const el = jsx(DummyComponent, {
    onPress: jest.fn(),
    children: null,
  })
  expect(el.props!.onPress).toMatchInlineSnapshot(`
    Object {
      "$": "event",
      "actions": Array [],
      "handler": [MockFunction],
      "key": "f7c20245-3545-47ee-a5a5-78424c08b184",
    }
  `)
})

it('should turn action into event', () => {
  const el = jsx(DummyComponent, {
    onPress: action('my-action'),
    children: null,
  })
  expect(el.props!.onPress).toMatchInlineSnapshot(`
    Object {
      "$": "event",
      "actions": Array [
        Object {
          "$": "action",
          "name": "my-action",
        },
      ],
    }
  `)
})
