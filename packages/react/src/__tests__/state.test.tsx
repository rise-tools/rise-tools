import { act, fireEvent, render } from '@testing-library/react'
import React from 'react'

import { DataSource, Template } from '../refs'
import { response } from '../response'
import { eventPayload, increment, setStateAction, state, toggle } from '../state'
import { BUILT_IN_COMPONENTS } from './template.test'

it('should render initial state', () => {
  const value = state('foo')
  const style = state({
    opacity: 0,
  })
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
            component: 'View',
            key: 'footer',
            props: {
              style,
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
      <div>
        foo
      </div>
      <div
        style="opacity: 0;"
      />
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
              onClick: setStateAction(value),
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
              onClick: setStateAction(value, 'custom-string-value'),
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
              disabled: isDisabled,
            },
          },
          {
            $: 'component',
            key: 'button',
            component: 'View',
            props: {
              ['data-testid']: 'button',
              onClick: setStateAction(isDisabled, toggle),
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
      <div />
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
        disabled=""
      />
      <div
        data-testid="button"
      />
    </DocumentFragment>
  `)
})

it('should increment state', async () => {
  const counter = state(1)
  const dataSource: DataSource = {
    get: () => ({
      subscribe: () => jest.fn(),
      get() {
        return [
          {
            $: 'component',
            key: 'header',
            component: 'View',
            children: counter,
          },
          {
            $: 'component',
            key: 'button',
            component: 'View',
            props: {
              ['data-testid']: 'button',
              onClick: setStateAction(counter, increment(2)),
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
      <div>
        1
      </div>
      <div
        data-testid="button"
      />
    </DocumentFragment>
  `)
  await act(async () => {
    fireEvent.click(component.getByTestId('button'))
    fireEvent.click(component.getByTestId('button'))
  })
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div>
        5
      </div>
      <div
        data-testid="button"
      />
    </DocumentFragment>
  `)
})

it('should modify state after receiving response from the server', async () => {
  const value = state('foo')
  const dataSource: DataSource = {
    get: () => ({
      subscribe: jest.fn().mockReturnValue(jest.fn()),
      get() {
        return {
          $: 'component',
          component: 'View',
          props: {
            ['data-testid']: 'button',
            onClick: {
              $: 'event',
            },
          },
          children: value,
        }
      },
    }),
    sendEvent: jest.fn().mockReturnValue(response(null).action(setStateAction(value, 'bar'))),
  }
  const component = render(<Template components={BUILT_IN_COMPONENTS} dataSource={dataSource} />)
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        data-testid="button"
      >
        foo
      </div>
    </DocumentFragment>
  `)
  await act(async () => {
    fireEvent.click(component.getByTestId('button'))
  })
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        data-testid="button"
      >
        bar
      </div>
    </DocumentFragment>
  `)
})

it('should inject state (initial value) into function handler', async () => {
  const onTemplateEvent = jest.fn().mockReturnValue(response(null))
  const isChecked = state(false)
  const dataSource: DataSource = {
    get: () => ({
      subscribe: () => jest.fn(),
      get() {
        return [
          {
            $: 'component',
            key: 'button',
            component: 'View',
            props: {
              ['data-testid']: 'button',
              onClick: {
                $: 'event',
                args: { isChecked },
              },
            },
          },
        ]
      },
    }),
    sendEvent: onTemplateEvent,
  }
  const component = render(<Template components={BUILT_IN_COMPONENTS} dataSource={dataSource} />)
  await act(async () => {
    fireEvent.click(component.getByTestId('button'))
  })
  expect(onTemplateEvent.mock.lastCall[0].payload[0]).toEqual({ isChecked: false })
})

it('should inject current state value into function handler', async () => {
  const onTemplateEvent = jest.fn().mockReturnValue(response(null))
  const isChecked = state(false)
  const dataSource: DataSource = {
    get: () => ({
      subscribe: () => jest.fn(),
      get() {
        return [
          {
            $: 'component',
            key: 'button',
            component: 'View',
            props: {
              ['data-testid']: 'button',
              onClick: {
                $: 'event',
                args: { isChecked },
              },
            },
          },
          {
            $: 'component',
            key: 'checkbox',
            component: 'View',
            props: {
              ['data-testid']: 'checkbox',
              onClick: setStateAction(isChecked, true),
            },
          },
        ]
      },
    }),
    sendEvent: onTemplateEvent,
  }
  const component = render(<Template components={BUILT_IN_COMPONENTS} dataSource={dataSource} />)
  await act(async () => {
    fireEvent.click(component.getByTestId('checkbox'))
    fireEvent.click(component.getByTestId('button'))
  })
  expect(onTemplateEvent.mock.lastCall[0].payload[0]).toEqual({ isChecked: true })
})

it('should lookup value from the arguments', async () => {
  const userName = state('')
  const dataSource: DataSource = {
    get: () => ({
      subscribe: () => jest.fn(),
      get() {
        return [
          {
            $: 'component',
            key: 'header',
            component: 'View',
            children: userName,
          },
          {
            $: 'component',
            key: 'button',
            component: 'View',
            props: {
              ['data-testid']: 'button',
              onClick: setStateAction(userName, eventPayload([0, 'user', 'name'])),
            },
          },
        ]
      },
    }),
    sendEvent: jest.fn(),
  }
  const component = render(
    <Template
      components={{
        View: {
          component: (props) => (
            <div {...props} onClick={() => props.onClick({ user: { name: 'Mike' } })} />
          ),
        },
      }}
      dataSource={dataSource}
    />
  )
  expect(component.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div />
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
      <div>
        Mike
      </div>
      <div
        data-testid="button"
      />
    </DocumentFragment>
  `)
})
