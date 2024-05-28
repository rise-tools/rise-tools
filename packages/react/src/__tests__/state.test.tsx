import { act, fireEvent, render } from '@testing-library/react'
import React from 'react'

import { event } from '../events'
import { DataSource, Template } from '../refs'
import { setStateAction, state, toggle } from '../state'
import { BUILT_IN_COMPONENTS } from './template.test'

it('should render initial state', () => {
  const value = state('foo')
  const dataSource: DataSource = {
    get: () => ({
      subscribe: () => jest.fn(),
      get() {
        return {
          $: 'component',
          component: 'View',
          children: value,
        }
      },
    }),
    sendEvent: jest.fn(),
  }
  const component = render(<Template components={BUILT_IN_COMPONENTS} dataSource={dataSource} />)
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        foo
      </div>
    </DocumentFragment>
  `)
})

it('should set state with default payload', async () => {
  const value = state('foo')
  const dataSource: DataSource = {
    get: () => ({
      subscribe: () => jest.fn(),
      get() {
        return [
          {
            $: 'component',
            key: 'header',
            component: 'View',
            children: value,
          },
          {
            $: 'component',
            key: 'button',
            component: 'View',
            props: {
              ['data-testid']: 'button',
              onClick: event(setStateAction(value)),
            },
          },
        ]
      },
    }),
    sendEvent: jest.fn(),
  }
  const onAction = jest.fn()
  const component = render(
    <Template components={BUILT_IN_COMPONENTS} dataSource={dataSource} onAction={onAction} />
  )
  await act(async () => {
    fireEvent.click(component.getByTestId('button'))
  })
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        [native code]
      </div>
      <div
        data-testid="button"
      />
    </DocumentFragment>
  `)
  expect(onAction).not.toBeCalled()
})

it('should set state with custom value', async () => {
  const value = state('foo')
  const dataSource: DataSource = {
    get: () => ({
      subscribe: () => jest.fn(),
      get() {
        return [
          {
            $: 'component',
            key: 'header',
            component: 'View',
            children: value,
          },
          {
            $: 'component',
            key: 'button',
            component: 'View',
            props: {
              ['data-testid']: 'button',
              onClick: event(setStateAction(value, 'custom-string-value')),
            },
          },
        ]
      },
    }),
    sendEvent: jest.fn(),
  }
  const component = render(<Template components={BUILT_IN_COMPONENTS} dataSource={dataSource} />)
  await act(async () => {
    fireEvent.click(component.getByTestId('button'))
  })
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        custom-string-value
      </div>
      <div
        data-testid="button"
      />
    </DocumentFragment>
  `)
})

it('should toggle state', async () => {
  const isDisabled = state(false)
  const dataSource: DataSource = {
    get: () => ({
      subscribe: () => jest.fn(),
      get() {
        return [
          {
            $: 'component',
            key: 'header',
            component: 'View',
            props: {
              ['data-testid']: 'header',
              disabled: isDisabled,
            },
          },
          {
            $: 'component',
            key: 'button',
            component: 'View',
            props: {
              ['data-testid']: 'button',
              onClick: event(setStateAction(isDisabled, toggle)),
            },
          },
        ]
      },
    }),
    sendEvent: jest.fn(),
  }
  const component = render(<Template components={BUILT_IN_COMPONENTS} dataSource={dataSource} />)
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        data-testid="header"
      />
      <div
        data-testid="button"
      />
    </DocumentFragment>
  `)
  await act(async () => {
    fireEvent.click(component.getByTestId('button'))
  })
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        data-testid="header"
        disabled=""
      />
      <div
        data-testid="button"
      />
    </DocumentFragment>
  `)
})
