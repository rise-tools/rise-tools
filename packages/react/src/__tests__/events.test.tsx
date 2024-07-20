import { fireEvent, render } from '@testing-library/react'
import React, { PropsWithChildren, ReactNode } from 'react'
import { beforeEach, expect, it, vi } from 'vitest'

import { BaseRise } from '../rise'

const View = {
  component: ({
    children,
    header,
    footer,
    onClick,
    ...props
  }: PropsWithChildren<{ header: ReactNode; onClick?: () => void; footer: ReactNode }>) => (
    <div
      {...props}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {children} {header} {footer}
    </div>
  ),
}

// We render one element in an array w/o key to test the path. It will trigger warning about
// missing keys by React.
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(vi.fn())
})

it('should assign correct path to an event target', () => {
  const onEvent = vi.fn()

  const component = render(
    <BaseRise
      components={{
        View,
      }}
      model={{
        $: 'component',
        component: 'View',
        children: {
          $: 'component',
          component: 'View',
          children: [
            {
              $: 'component',
              component: 'View',
              key: 'container',
              props: {
                ['data-testid']: 'button',
                onClick: {
                  $: 'event',
                },
                header: {
                  $: 'component',
                  component: 'View',
                  props: {
                    ['data-testid']: 'button-prop',
                    onClick: {
                      $: 'event',
                    },
                  },
                },
                footer: [
                  {
                    $: 'component',
                    key: 'footer',
                    component: 'View',
                    props: {
                      ['data-testid']: 'button-prop-array',
                      onClick: {
                        $: 'event',
                      },
                    },
                  },
                  {
                    $: 'component',
                    component: 'View',
                    props: {
                      ['data-testid']: 'button-prop-array-idx',
                      onClick: {
                        $: 'event',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      }}
      onEvent={onEvent}
    />
  )

  // nested children
  fireEvent.click(component.getByTestId('button'))
  expect(onEvent.mock.lastCall?.[0].target.path).toMatchInlineSnapshot(`
    [
      "",
      "children",
      "children",
      "container",
      "props",
      "onClick",
    ]
  `)

  // prop is a single child
  fireEvent.click(component.getByTestId('button-prop'))
  expect(onEvent.mock.lastCall?.[0].target.path).toMatchInlineSnapshot(`
    [
      "",
      "children",
      "children",
      "container",
      "props",
      "header",
      "props",
      "onClick",
    ]
  `)

  // prop has elements as an array
  fireEvent.click(component.getByTestId('button-prop-array'))
  expect(onEvent.mock.lastCall?.[0].target.path).toMatchInlineSnapshot(`
    [
      "",
      "children",
      "children",
      "container",
      "props",
      "footer",
      "footer",
      "props",
      "onClick",
    ]
  `)

  // prop has elements as an array without keys
  fireEvent.click(component.getByTestId('button-prop-array-idx'))
  expect(onEvent.mock.lastCall?.[0].target.path).toMatchInlineSnapshot(`
    [
      "",
      "children",
      "children",
      "container",
      "props",
      "footer",
      1,
      "props",
      "onClick",
    ]
  `)

  expect(onEvent).toHaveBeenCalledTimes(4)
})
