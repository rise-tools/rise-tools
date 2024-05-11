import { act, fireEvent, render } from '@testing-library/react'
import React, { useState } from 'react'

import { action } from '../events'
import {
  ActionEvent,
  BaseTemplate,
  ComponentDefinition,
  ComponentRegistry,
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
        $: 'component',
        component: 'View',
        props: {
          height: 50,
        },
      }}
      onTemplateEvent={jest.fn()}
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

it('should render an array of components', () => {
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      dataState={[
        {
          $: 'component',
          key: 'HeadingComponent',
          component: 'View',
          children: 'Heading',
        },
        {
          $: 'component',
          key: 'HelloWorldComponent',
          component: 'View',
          children: 'Hello, world!',
        },
      ]}
      onTemplateEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        Heading
      </div>
      <div>
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
        $: 'component',
        component: 'View',
        children: {
          $: 'component',
          component: 'View',
          key: 'customKey',
          children: [
            {
              $: 'component',
              key: 'HelloComponent',
              component: 'View',
              children: 'Hello',
            },
            {
              $: 'component',
              component: 'View',
              key: 'WorldComponent',
              children: 'World!',
            },
          ],
        },
      }}
      onTemplateEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        <div>
          <div>
            Hello
          </div>
          <div>
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
        $: 'component',
        component: 'View',
        children: {
          $: 'component',
          component: 'View',
          children: 'Hello, world!',
        },
      }}
      onTemplateEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        <div>
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
        $: 'component',
        component: 'View',
        children: [
          'Hello',
          {
            $: 'component',
            key: 'MyComponent',
            component: 'View',
            children: 'world!',
          },
        ],
      }}
      onTemplateEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        Hello
        <div>
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
        $: 'component',
        component: 'Header',
        props: {
          header: {
            $: 'component',
            component: 'View',
            children: 'Header text',
          },
          paragraph: {
            $: 'component',
            component: 'View',
            children: 'Footer text',
          },
        },
      }}
      onTemplateEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <section>
        <header>
          <div>
            Header text
          </div>
        </header>
        <footer>
          <div>
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
        $: 'component',
        component: 'Header',
        props: {
          user: {
            name: 'Mike',
          },
        },
      }}
      onTemplateEvent={jest.fn()}
    />
  )

  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <section>
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
        $: 'component',
        key: 'button',
        component: 'View',
        props: {
          ['data-testid']: 'button',
          onClick: action('foo-action'),
        },
      }}
      onTemplateEvent={onEvent}
    />
  )

  fireEvent.click(component.getByTestId('button'))

  expect(onEvent).toHaveBeenCalledTimes(1)

  const firedEvent = onEvent.mock.lastCall[0] as TemplateEvent
  expect(firedEvent).toMatchObject({
    dataState: {
      $: 'event',
      action: 'foo-action',
    },
    target: {
      key: 'button',
      component: 'View',
      propKey: 'onClick',
      path: '',
    },
    payload: '[native code]',
  })
})

it('should validate props with a validator', () => {
  const validator = jest.fn().mockImplementation((args) => args)
  const props = {
    foo: 'foo',
    bar: 'bar',
  }

  render(
    <BaseTemplate
      components={{
        View: {
          component: () => <div />,
          validator,
        },
      }}
      path="mainState"
      dataState={{
        $: 'component',
        key: 'button',
        component: 'View',
        props,
      }}
      onTemplateEvent={jest.fn()}
    />
  )

  expect(validator).toHaveBeenCalledWith(props)
})

it('should send a template event', () => {
  const onEvent = jest.fn()
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      path="mainState"
      dataState={{
        $: 'component',
        key: 'button',
        component: 'View',
        props: {
          ['data-testid']: 'button',
          onClick: action('go-back'),
        },
      }}
      onTemplateEvent={onEvent}
    />
  )
  fireEvent.click(component.getByTestId('button'))

  const firedEvent = onEvent.mock.lastCall[0] as TemplateEvent
  expect(firedEvent.target.path).toBe('mainState')
})

it('should pass return type from onTemplateEvent back to component', async () => {
  const onEvent = jest.fn().mockReturnValue('Mike')

  const component = render(
    <BaseTemplate
      components={{
        Profile: {
          component: ({ onClick }) => {
            const [name, setName] = useState()
            if (!name) {
              return (
                <div
                  data-testid="button"
                  onClick={async () => {
                    const name = await onClick()
                    setName(name)
                  }}
                >
                  Click to load!
                </div>
              )
            }
            return <div>{name}</div>
          },
        },
      }}
      path="mainState"
      dataState={{
        $: 'component',
        key: 'button',
        component: 'Profile',
        props: {
          onClick: action('go-back'),
        },
      }}
      onTemplateEvent={onEvent}
    />
  )
  await act(async () => {
    fireEvent.click(component.getByTestId('button'))
  })
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        Mike
      </div>
    </DocumentFragment>
  `)
})

it('should fire multiple template events for an array of actions', () => {
  const onEvent = jest.fn()
  const component = render(
    <BaseTemplate
      components={BUILT_IN_COMPONENTS}
      path="mainState"
      dataState={{
        $: 'component',
        key: 'button',
        component: 'View',
        props: {
          ['data-testid']: 'button',
          onClick: [action('go-back'), action('go-back-again')],
        },
      }}
      onTemplateEvent={onEvent}
    />
  )
  fireEvent.click(component.getByTestId('button'))

  expect((onEvent.mock.calls[0][0] as ActionEvent).dataState.action).toBe('go-back')
  expect((onEvent.mock.calls[1][0] as ActionEvent).dataState.action).toBe('go-back-again')
})
