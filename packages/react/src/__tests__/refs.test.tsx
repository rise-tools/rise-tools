import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import { action, ActionEventDataState, DataSource, response, Template } from '..'
import { BUILT_IN_COMPONENTS } from './template.test'

it('should render a component', () => {
  const dataSource: DataSource = {
    get: () => ({
      subscribe: () => jest.fn(),
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
    sendEvent: jest.fn(),
  }
  const component = render(
    <Template
      components={BUILT_IN_COMPONENTS}
      dataSource={dataSource}
      onEvent={dataSource.sendEvent}
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
  const getStore = jest.fn().mockReturnValue({
    subscribe: () => jest.fn(),
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
  const dataSource: DataSource = {
    get: getStore,
    sendEvent: jest.fn(),
  }
  const component = render(
    <Template
      components={BUILT_IN_COMPONENTS}
      dataSource={dataSource}
      onEvent={dataSource.sendEvent}
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
  const dataSource: DataSource = {
    get: (store: string) => {
      if (store === 'secondStore') {
        return {
          subscribe: () => jest.fn(),
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
        subscribe: () => jest.fn(),
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
              {
                $: 'ref',
                ref: 'secondStore',
              },
            ],
          }
        },
      }
    },
    sendEvent: jest.fn(),
  }
  const component = render(
    <Template
      components={BUILT_IN_COMPONENTS}
      dataSource={dataSource}
      onEvent={dataSource.sendEvent}
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
  const dataSource: DataSource = {
    get: (store: string) => {
      if (store === 'secondStore') {
        return {
          subscribe: () => jest.fn(),
          get() {
            return {
              $: 'component',
              key: 'ReferencedViewComponent',
              component: 'View',
              props: {
                ['data-testid']: 'button-referenced',
                onClick: action('go-back-referenced'),
              },
            }
          },
        }
      }
      return {
        subscribe: () => jest.fn(),
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
                  onClick: action('go-back-local'),
                },
              },
              {
                $: 'ref',
                ref: 'secondStore',
              },
            ],
          }
        },
      }
    },
    sendEvent: jest.fn().mockResolvedValue(response(null)),
  }

  const onAction = jest.fn()
  const component = render(
    <Template
      components={BUILT_IN_COMPONENTS}
      path="mainStore"
      dataSource={dataSource}
      onAction={onAction}
    />
  )
  fireEvent.click(component.getByTestId('button-local'))
  expect((onAction.mock.lastCall[0] as ActionEventDataState).action).toEqual('go-back-local')

  fireEvent.click(component.getByTestId('button-referenced'))
  expect((onAction.mock.lastCall[0] as ActionEventDataState).action).toEqual('go-back-referenced')
})

it('should subscribe to the root store', () => {
  const mainStoreUnsubscribeFunction = jest.fn()
  const mainStoreSubscribeFunction = jest.fn().mockReturnValue(mainStoreUnsubscribeFunction)
  const dataSource: DataSource = {
    get: () => ({
      subscribe: mainStoreSubscribeFunction,
      get() {
        return {
          $: 'component',
          component: 'View',
        }
      },
    }),
    sendEvent: jest.fn(),
  }
  const element = render(
    <Template
      components={BUILT_IN_COMPONENTS}
      dataSource={dataSource}
      onEvent={dataSource.sendEvent}
      path="mainStore"
    />
  )
  expect(mainStoreSubscribeFunction).toHaveBeenCalledTimes(1)
  expect(mainStoreUnsubscribeFunction).toHaveBeenCalledTimes(0)

  element.unmount()
  expect(mainStoreUnsubscribeFunction).toHaveBeenCalledTimes(1)
})

it('should manage subscription to stores referenced by refs', () => {
  const mainStoreUnsubscribeFunction = jest.fn()
  const mainStoreSubscribeFunction = jest.fn().mockReturnValue(mainStoreUnsubscribeFunction)

  const secondStoreUnsubscribeFunction = jest.fn()
  const secondStoreSubscribeFunction = jest.fn().mockReturnValue(secondStoreUnsubscribeFunction)

  const dataSource: DataSource = {
    get: (name: string) => {
      if (name === 'mainStore') {
        return {
          subscribe: mainStoreSubscribeFunction,
          get() {
            return {
              $: 'component',
              component: 'View',
              children: {
                $: 'ref',
                ref: ['secondStore', 'user', 'profile', 'name'],
              },
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
    sendEvent: jest.fn(),
  }

  const element = render(
    <Template
      components={BUILT_IN_COMPONENTS}
      dataSource={dataSource}
      onEvent={dataSource.sendEvent}
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

it.skip('should remove subscription to refs no longer in use', () => {
  // todo
})

it.skip('should resolve new refs after data change', () => {
  // todo
})
