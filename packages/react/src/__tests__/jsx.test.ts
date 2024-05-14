import { action } from '../events'
import { createComponentDefinition, jsx } from '../jsx'
import { isEventDataState } from '../template'

const DummyComponent = createComponentDefinition('DummyComponent')

it('should turn function into event', () => {
  const el = jsx(DummyComponent, {
    onPress: jest.fn(),
    children: null,
  })
  expect(isEventDataState(el.props!.onPress)).toBe(true)
})

it('should turn action into event', () => {
  const el = jsx(DummyComponent, {
    onPress: action('my-action'),
    children: null,
  })
  expect(isEventDataState(el.props!.onPress)).toBe(true)
})
