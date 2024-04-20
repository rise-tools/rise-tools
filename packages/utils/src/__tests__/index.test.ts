import { update } from '../index'

it('should update and keep ref', () => {
  const state = {
    a: {
      $: 'component',
      component: 'div',
      children: {
        $: 'ref',
        ref: 'b',
      },
    },
  }
  const newState = {
    a: {
      $: 'component',
      component: 'p', // this value is different
      children: {
        $: 'ref',
        ref: 'b',
      },
    },
  }
  const updatedState = update(state, newState)

  // value is updated
  expect(updatedState.a.component).toBe('p')

  // children did not change, object reused
  expect(updatedState.a.children).toBe(state.a.children)

  // state.a is a new object, b/c 'component' property is different
  expect(updatedState.a).not.toBe(state.a)
})
