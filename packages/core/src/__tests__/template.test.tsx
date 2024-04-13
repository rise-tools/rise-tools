/**
 * @jest-environment jsdom
 */

import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import {
  BaseTemplate,
  ComponentDefinition,
  ComponentRegistry,
  DataStateType,
  TemplateEvent,
} from '../template'

export const BUILT_IN_COMPONENTS: ComponentRegistry = {
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
        component: 'View',
        props: {
          height: 50,
        },
      }}
      onEvent={jest.fn()}
    />
  )

  expect(component.getByTestId('root')).toMatchInlineSnapshot(`
    <div
      data-testid="root"
      height="50"
    />
  `)
})

it('should render an array of components', () => {
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      dataState={[
        {
          $: DataStateType.Component,
          component: 'View',
          children: 'Heading',
        },
        {
          $: DataStateType.Component,
          component: 'View',
          children: 'Hello, world!',
        },
      ]}
      onEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        data-testid="root[0]"
      >
        Heading
      </div>
      <div
        data-testid="root[1]"
      >
        Hello, world!
      </div>
    </DocumentFragment>
  `)
})

it('should use component key when provided', () => {
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      dataState={{
        $: DataStateType.Component,
        component: 'View',
        children: {
          $: DataStateType.Component,
          component: 'View',
          key: 'customKey',
          children: [
            {
              $: DataStateType.Component,
              component: 'View',
              children: 'Hello',
            },
            {
              $: DataStateType.Component,
              component: 'View',
              key: 'customChildKey',
              children: 'World!',
            },
          ],
        },
      }}
      onEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        data-testid="root"
      >
        <div
          data-testid="root.children[customKey]"
        >
          <div
            data-testid="root.children[customKey].children[0]"
          >
            Hello
          </div>
          <div
            data-testid="root.children[customKey].children[customChildKey]"
          >
            World!
          </div>
        </div>
      </div>
    </DocumentFragment>
  `)
})

it('should render a component with single children', () => {
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      dataState={{
        $: DataStateType.Component,
        component: 'View',
        children: {
          $: DataStateType.Component,
          component: 'View',
          children: 'Hello, world!',
        },
      }}
      onEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        data-testid="root"
      >
        <div
          data-testid="root.children"
        >
          Hello, world!
        </div>
      </div>
    </DocumentFragment>
  `)
})

it('should render a component with children of different types', () => {
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      dataState={{
        $: DataStateType.Component,
        component: 'View',
        children: [
          'Hello',
          {
            $: DataStateType.Component,
            component: 'View',
            children: 'world!',
          },
        ],
      }}
      onEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        data-testid="root"
      >
        Hello
        <div
          data-testid="root.children[1]"
        >
          world!
        </div>
      </div>
    </DocumentFragment>
  `)
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
        Header,
      }}
      dataState={{
        $: DataStateType.Component,
        component: 'Header',
        props: {
          header: {
            $: DataStateType.Component,
            component: 'View',
            children: 'Header text',
          },
          paragraph: {
            $: DataStateType.Component,
            component: 'View',
            children: 'Footer text',
          },
        },
      }}
      onEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <section>
        <header>
          <div
            data-testid="root.props[header]"
          >
            Header text
          </div>
        </header>
        <footer>
          <div
            data-testid="root.props[paragraph]"
          >
            Footer text
          </div>
        </footer>
      </section>
    </DocumentFragment>
  `)
})

it('should accept object as a prop', () => {
  const Header: ComponentDefinition<{ user: { name: string } }> = {
    component: ({ user, ...props }) => (
      <section {...props}>
        <header>{user.name}</header>
      </section>
    ),
  }

  const component = render(
    <BaseTemplate
      components={{
        Header,
      }}
      dataState={{
        $: DataStateType.Component,
        component: 'Header',
        props: {
          user: {
            name: 'Mike',
          },
        },
      }}
      onEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <section
        data-testid="root"
      >
        <header>
          Mike
        </header>
      </section>
    </DocumentFragment>
  `)
})

it('should accept event handler as a prop', () => {
  const onEvent = jest.fn()
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      dataState={{
        $: DataStateType.Component,
        key: 'button',
        component: 'View',
        props: {
          onClick: {
            $: 'event',
            action: 'navigate',
          },
        },
      }}
      onEvent={onEvent}
    />
  )

  fireEvent.click(component.getByTestId('root[button]'))

  expect(onEvent).toHaveBeenCalledTimes(1)

  const firedEvent = onEvent.mock.lastCall[0] as TemplateEvent
  expect(firedEvent).toMatchObject({
    action: 'navigate',
    name: 'onClick',
    target: {
      key: 'button',
      path: 'root[button]',
    },
  })
  expect(firedEvent.payload?.[0].constructor.name).toBe('SyntheticBaseEvent')
})

it('should accept multiple event handlers as a prop', () => {
  const onEvent = jest.fn()
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      dataState={{
        $: DataStateType.Component,
        key: 'button',
        component: 'View',
        props: {
          onClick: [
            {
              $: 'event',
              action: 'navigate',
            },
            {
              $: 'event',
              action: 'onButtonPressed',
            },
          ],
        },
      }}
      onEvent={onEvent}
    />
  )

  fireEvent.click(component.getByTestId('root[button]'))

  expect(onEvent).toHaveBeenCalledTimes(2)
  expect(onEvent.mock.calls.map((c) => c[0].action)).toMatchObject(['navigate', 'onButtonPressed'])
})

it.skip('should validate props with a validator', () => {})
