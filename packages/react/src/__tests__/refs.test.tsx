import { render } from '@testing-library/react'
import React from 'react'

import { DataSource, Template } from '..'
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
  const getStore = jest.fn().mockReturnValue({
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
            ref: ['mainStore', 'children', 0],
          },
        ],
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
      path="mainStore"
    />
  )

  expect(getStore).toHaveBeenLastCalledWith('mainStore')
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        <div>
          Hello World!
        </div>
        <div>
          Hello World!
        </div>
      </div>
    </DocumentFragment>
  `)
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
