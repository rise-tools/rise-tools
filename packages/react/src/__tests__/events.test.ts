import { action, getAllEventHandlers, handler, ServerDataState } from '../events'

it('should return all event handlers from the object', () => {
  const eventHandler = handler(jest.fn())

  const state: ServerDataState = {
    $: 'component',
    component: 'View',
    props: {
      // this is not an event handler and should be ignored
      onPress: action('foo'),
    },
    children: {
      $: 'component',
      component: 'View',
      props: {
        onPress: eventHandler,
      },
    },
  }

  const res = getAllEventHandlers(state)

  expect(Object.keys(res).length).toBe(1)
  expect(getAllEventHandlers(state)[eventHandler.key]).toBeDefined()
})
