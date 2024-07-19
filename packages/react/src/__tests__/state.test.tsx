import { act, fireEvent, render } from '@testing-library/react'
import React from 'react'
import { expect, it, vi } from 'vitest'

import { ModelSource, Rise } from '../refs'
import { response } from '../response'
import { eventPayload, increment, localStateExperimental, setStateAction, toggle } from '../state'
import { BUILT_IN_COMPONENTS } from './rise.test'

it('should render initial localStateExperimental', () => {
  const value = localStateExperimental('foo', 'example/value')
  const style = localStateExperimental(
    {
      opacity: 0,
    },
    'example/style'
  )
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: () => vi.fn(),
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
    sendEvent: vi.fn(),
  }
  const component = render(<Rise components={BUILT_IN_COMPONENTS} modelSource={modelSource} />)
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

it('should set localStateExperimental with default payload', async () => {
  const value = localStateExperimental('foo', 'example/value')
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: () => vi.fn(),
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
    sendEvent: vi.fn(),
  }
  const component = render(<Rise components={BUILT_IN_COMPONENTS} modelSource={modelSource} />)
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
})

it('should set localStateExperimental with custom value', async () => {
  const value = localStateExperimental('foo', 'example/value')
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: () => vi.fn(),
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
    sendEvent: vi.fn(),
  }
  const component = render(<Rise components={BUILT_IN_COMPONENTS} modelSource={modelSource} />)
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

it('should toggle localStateExperimental', async () => {
  const isDisabled = localStateExperimental(false, 'example/is-disabled')
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: () => vi.fn(),
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
    sendEvent: vi.fn(),
  }
  const component = render(<Rise components={BUILT_IN_COMPONENTS} modelSource={modelSource} />)
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

it('should increment localStateExperimental', async () => {
  const counter = localStateExperimental(1, 'example/counter')
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: () => vi.fn(),
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
    sendEvent: vi.fn(),
  }
  const component = render(<Rise components={BUILT_IN_COMPONENTS} modelSource={modelSource} />)
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

it('should modify localStateExperimental after receiving response from the server', async () => {
  const value = localStateExperimental('foo', 'example/value')
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: vi.fn().mockReturnValue(vi.fn()),
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
    sendEvent: vi.fn().mockReturnValue(response(setStateAction(value, 'bar'), { key: '123' })),
  }
  const component = render(<Rise components={BUILT_IN_COMPONENTS} modelSource={modelSource} />)
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

it('should inject localStateExperimental (initial value) into function handler', async () => {
  const onEvent = vi.fn().mockReturnValue(response(null))
  const isChecked = localStateExperimental(false, 'example/is-checked')
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: () => vi.fn(),
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
    sendEvent: onEvent,
  }
  const component = render(<Rise components={BUILT_IN_COMPONENTS} modelSource={modelSource} />)
  await act(async () => {
    fireEvent.click(component.getByTestId('button'))
  })
  expect(onEvent.mock.lastCall?.[0].payload[0]).toEqual({ isChecked: false })
})

it('should inject current localStateExperimental value into function handler', async () => {
  const onEvent = vi.fn().mockReturnValue(response(null))
  const isChecked = localStateExperimental(false, 'example/is-checked')
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: () => vi.fn(),
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
    sendEvent: onEvent,
  }
  const component = render(<Rise components={BUILT_IN_COMPONENTS} modelSource={modelSource} />)
  await act(async () => {
    fireEvent.click(component.getByTestId('checkbox'))
    fireEvent.click(component.getByTestId('button'))
  })
  expect(onEvent.mock.lastCall?.[0].payload[0]).toEqual({ isChecked: true })
})

it('should lookup value from the arguments', async () => {
  const userName = localStateExperimental('', 'example/user-name')
  const modelSource: ModelSource = {
    get: () => ({
      subscribe: () => vi.fn(),
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
    sendEvent: vi.fn(),
  }
  const component = render(
    <Rise
      components={{
        View: {
          component: (props) => (
            <div {...props} onClick={() => props.onClick({ user: { name: 'Mike' } })} />
          ),
        },
      }}
      modelSource={modelSource}
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
