/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import React from 'react'

import { DataStateType, Template } from '..'
import { BUILT_IN_COMPONENTS } from './template.test'

it('should render a component', () => {
  const dataSource = {
    get: () => ({
      subscribe: () => jest.fn(),
      get() {
        return {
          $: DataStateType.Component,
          component: 'View',
          props: {
            height: 50,
          },
        }
      },
    }),
  }
  const component = render(
    <Template components={BUILT_IN_COMPONENTS} dataSource={dataSource} onEvent={jest.fn()} />
  )

  expect(component.getByTestId('root')).toMatchInlineSnapshot(`
    <div
      data-testid="root"
      height="50"
    />
  `)
})

it('should render a component at path', () => {
  const getStore = jest.fn().mockReturnValue({
    subscribe: () => jest.fn(),
    get() {
      return {
        $: DataStateType.Component,
        component: 'View',
        children: {
          $: DataStateType.Component,
          component: 'View',
          children: 'Hello World!',
        },
      }
    },
  })
  const dataSource = {
    get: getStore,
  }
  const component = render(
    <Template
      components={BUILT_IN_COMPONENTS}
      dataSource={dataSource}
      onEvent={jest.fn()}
      path={['mainStore', 'children']}
    />
  )

  expect(getStore).toHaveBeenCalledWith('mainStore')
  expect(component.getByTestId('root')).toMatchInlineSnapshot(`
    <div
      data-testid="root"
    >
      Hello World!
    </div>
  `)
})
