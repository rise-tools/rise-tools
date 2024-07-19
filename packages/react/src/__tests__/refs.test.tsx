import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { expect, it, vi } from 'vitest'

import { action, ModelSource, ref, response, Rise } from '..'
import { BUILT_IN_COMPONENTS } from './rise.test'

it('should render a component', () => {
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: () => vi.fn(),
      get() {
        return {
          $: 'component',
          component: 'View',
          props: {
            height: 50,
          },
        }
      },
    }),
    sendEvent: vi.fn(),
  }
  const component = render(
    <Rise
      components={BUILT_IN_COMPONENTS}
      modelSource={modelSource}
      onEvent={modelSource.sendEvent}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        height="50"
      />
    </DocumentFragment>
  `)
})

it('should render component at a path', () => {
  const getStore = vi.fn().mockReturnValue({
    subscribe: () => vi.fn(),
    get() {
      return {
        $: 'component',
        component: 'View',
        children: {
          $: 'component',
          component: 'View',
          children: 'Hello World!',
        },
      }
    },
  })
  const modelSource: ModelSource = {
    get: getStore,
    sendEvent: vi.fn(),
  }
  const component = render(
    <Rise
      components={BUILT_IN_COMPONENTS}
      modelSource={modelSource}
      onEvent={modelSource.sendEvent}
      path={['mainStore', 'children']}
    />
  )

  expect(getStore).toHaveBeenCalledWith('mainStore')
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        Hello World!
      </div>
    </DocumentFragment>
  `)
})

it('should resolve a ref', () => {
  const modelSource: ModelSource = {
    get: (store: string) => {
      if (store === 'secondStore') {
        return {
          subscribe: () => vi.fn(),
          get() {
            return {
              $: 'component',
              key: 'SecondViewComponent',
              component: 'View',
              children: 'Referenced',
            }
          },
        }
      }
      return {
        subscribe: () => vi.fn(),
        get() {
          return {
            $: 'component',
            component: 'View',
            children: [
              {
                $: 'component',
                key: 'ViewComponent',
                component: 'View',
                children: 'Hello World!',
              },
              ref('secondStore'),
            ],
          }
        },
      }
    },
    sendEvent: vi.fn(),
  }
  const component = render(
    <Rise
      components={BUILT_IN_COMPONENTS}
      modelSource={modelSource}
      onEvent={modelSource.sendEvent}
      path="mainStore"
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        <div>
          Hello World!
        </div>
        <div>
          Referenced
        </div>
      </div>
    </DocumentFragment>
  `)
})

it('should send an action with ref as a path when trigerred by referenced component', () => {
  const modelSource: ModelSource = {
    get: (store: string) => {
      if (store === 'secondStore') {
        return {
          subscribe: () => vi.fn(),
          get() {
            return {
              $: 'component',
              key: 'ReferencedViewComponent',
              component: 'View',
              props: {
                ['data-testid']: 'button-referenced',
                onClick: action('test', { path: 'referenced' }),
              },
            }
          },
        }
      }
      return {
        subscribe: () => vi.fn(),
        get() {
          return {
            $: 'component',
            component: 'View',
            children: [
              {
                $: 'component',
                key: 'ViewComponent',
                component: 'View',
                props: {
                  ['data-testid']: 'button-local',
                  onClick: action('test', { path: 'local' }),
                },
              },
              ref('secondStore'),
            ],
          }
        },
      }
    },
    sendEvent: vi.fn().mockResolvedValue(response(null)),
  }

  const actionHandler = vi.fn()
  const component = render(
    <Rise
      components={BUILT_IN_COMPONENTS}
      path="mainStore"
      modelSource={modelSource}
      actions={{
        test: {
          action: actionHandler,
        },
      }}
    />
  )
  fireEvent.click(component.getByTestId('button-local'))
  expect(actionHandler).toHaveBeenLastCalledWith({ path: 'local' })

  fireEvent.click(component.getByTestId('button-referenced'))
  expect(actionHandler).toHaveBeenLastCalledWith({ path: 'referenced' })
})

it('should subscribe to the root store', () => {
  const mainStoreUnsubscribeFunction = vi.fn()
  const mainStoreSubscribeFunction = vi.fn().mockReturnValue(mainStoreUnsubscribeFunction)
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: mainStoreSubscribeFunction,
      get() {
        return {
          $: 'component',
          component: 'View',
        }
      },
    }),
    sendEvent: vi.fn(),
  }
  const element = render(
    <Rise
      components={BUILT_IN_COMPONENTS}
      modelSource={modelSource}
      onEvent={modelSource.sendEvent}
      path="mainStore"
    />
  )
  expect(mainStoreSubscribeFunction).toHaveBeenCalledTimes(1)
  expect(mainStoreUnsubscribeFunction).toHaveBeenCalledTimes(0)

  element.unmount()
  expect(mainStoreUnsubscribeFunction).toHaveBeenCalledTimes(1)
})

it('should manage subscription to stores referenced by refs', () => {
  const mainStoreUnsubscribeFunction = vi.fn()
  const mainStoreSubscribeFunction = vi.fn().mockReturnValue(mainStoreUnsubscribeFunction)

  const secondStoreUnsubscribeFunction = vi.fn()
  const secondStoreSubscribeFunction = vi.fn().mockReturnValue(secondStoreUnsubscribeFunction)

  const modelSource: ModelSource = {
    get: (name: string) => {
      if (name === 'mainStore') {
        return {
          subscribe: mainStoreSubscribeFunction,
          get() {
            return {
              $: 'component',
              component: 'View',
              children: ref(['secondStore', 'user', 'profile', 'name']),
            }
          },
        }
      } else {
        return {
          subscribe: secondStoreSubscribeFunction,
          get() {
            return {
              user: {
                profile: {
                  name: 'John Doe',
                },
              },
            }
          },
        }
      }
    },
    sendEvent: vi.fn(),
  }

  const element = render(
    <Rise
      components={BUILT_IN_COMPONENTS}
      modelSource={modelSource}
      onEvent={modelSource.sendEvent}
      path="mainStore"
    />
  )

  expect(mainStoreSubscribeFunction).toHaveBeenCalledTimes(1)
  expect(secondStoreSubscribeFunction).toHaveBeenCalledTimes(1)

  expect(element.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        John Doe
      </div>
    </DocumentFragment>
  `)

  element.unmount()

  expect(mainStoreUnsubscribeFunction).toHaveBeenCalledTimes(1)
  expect(secondStoreUnsubscribeFunction).toHaveBeenCalledTimes(1)
})

it('should dispatch all actions associated with an event', () => {
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: vi.fn().mockReturnValue(vi.fn()),
      get() {
        return {
          $: 'component',
          component: 'View',
          props: {
            ['data-testid']: 'button',
            onClick: [action('navigate', { path: 'foo' }), action('navigate', { path: 'bar' })],
          },
        }
      },
    }),
    sendEvent: vi.fn().mockReturnValue(response(null)),
  }
  const actionHandler = vi.fn()
  const component = render(
    <Rise
      components={BUILT_IN_COMPONENTS}
      modelSource={modelSource}
      actions={{
        navigate: { action: actionHandler },
      }}
    />
  )
  fireEvent.click(component.getByTestId('button'))
  expect(actionHandler).toHaveBeenCalledTimes(2)
  expect(actionHandler).toHaveBeenLastCalledWith({ path: 'bar' })
})

it.skip('should remove subscription to refs no longer in use', () => {
  // todo
})

it.skip('should resolve new refs after data change', () => {
  // todo
})
