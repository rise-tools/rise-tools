import { fireEvent, render } from '@testing-library/react'
import React, { PropsWithChildren, ReactNode } from 'react'

import { event } from '../events'
import { BaseTemplate } from '../template'

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

it('should assign correct path to an event target', () => {
  const onTemplateEvent = jest.fn()

  const component = render(
    <BaseTemplate
      components={{
        View,
      }}
      dataState={{
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
                onClick: event(jest.fn()),
                header: {
                  $: 'component',
                  component: 'View',
                  props: {
                    ['data-testid']: 'button-prop',
                    onClick: event(jest.fn()),
                  },
                },
                footer: [
                  {
                    $: 'component',
                    key: 'footer',
                    component: 'View',
                    props: {
                      ['data-testid']: 'button-prop-array',
                      onClick: event(jest.fn()),
                    },
                  },
                ],
              },
            },
          ],
        },
      }}
      onTemplateEvent={onTemplateEvent}
    />
  )

  // nested children
  fireEvent.click(component.getByTestId('button'))
  expect(onTemplateEvent.mock.lastCall[0].target.path).toMatchInlineSnapshot(`
    Array [
      "",
      "children",
      "children",
      0,
      "props",
      "onClick",
    ]
  `)

  // prop is a single child
  fireEvent.click(component.getByTestId('button-prop'))
  expect(onTemplateEvent.mock.lastCall[0].target.path).toMatchInlineSnapshot(`
    Array [
      "",
      "children",
      "children",
      0,
      "props",
      "header",
      "props",
      "onClick",
    ]
  `)

  // prop has elements as an array
  fireEvent.click(component.getByTestId('button-prop-array'))
  expect(onTemplateEvent.mock.lastCall[0].target.path).toMatchInlineSnapshot(`
    Array [
      "",
      "children",
      "children",
      0,
      "props",
      "footer",
      0,
      "props",
      "onClick",
    ]
  `)

  expect(onTemplateEvent).toHaveBeenCalledTimes(3)
})
