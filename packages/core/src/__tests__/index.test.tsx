/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import React from 'react'

import { BaseTemplate, ComponentDefinition, ComponentRegistry, DataStateType } from '../template'

const BUILT_IN_COMPONENTS: ComponentRegistry = {
  View: {
    component: (props) => <div {...props} />,
  },
}

it('should render a component', () => {
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      dataState={{
        $: DataStateType.Component,
        key: '$root',
        component: 'View',
        props: {
          height: 50,
        },
      }}
      onEvent={jest.fn()}
    />
  )

  expect(component.getByTestId('$root')).toMatchSnapshot()
})

it('should render an array of components', () => {
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      dataState={[
        {
          $: DataStateType.Component,
          key: '$heading',
          component: 'View',
          children: 'Heading',
        },
        {
          $: DataStateType.Component,
          key: '$paragraph',
          component: 'View',
          children: 'Hello, world!',
        },
      ]}
      onEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchSnapshot()
})

it('should render a component with children of different types', () => {
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      dataState={[
        {
          $: DataStateType.Component,
          key: '$heading',
          component: 'View',
          children: [
            'Hello',
            {
              $: DataStateType.Component,
              key: '$nested',
              component: 'View',
              children: 'world!',
            },
          ],
        },
      ]}
      onEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchSnapshot()
})

it('should accept component as a prop', () => {
  const Header: ComponentDefinition<{ header: string; paragraph: string }> = {
    component: (props) => (
      <section>
        <header>{props.header}</header>
        <footer>{props.paragraph}</footer>
      </section>
    ),
  }

  const component = render(
    <BaseTemplate
      components={{
        ...BUILT_IN_COMPONENTS,
        // @ts-ignore figure why this type does not work
        Header,
      }}
      dataState={[
        {
          $: DataStateType.Component,
          key: '$heading',
          component: 'Header',
          props: {
            header: {
              $: DataStateType.Component,
              key: '$header',
              component: 'View',
              children: 'Header text',
            },
            paragraph: {
              $: DataStateType.Component,
              key: '$footer',
              component: 'View',
              children: 'Footer text',
            },
          },
        },
      ]}
      onEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchSnapshot()
})
