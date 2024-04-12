/**
 * @jest-environment jsdom
 */

import { BaseTemplate, DataStateType } from '@react-native-templates/core'
import { config } from '@tamagui/config/v3'
import { render } from '@testing-library/react'
import React from 'react'
import { createTamagui, TamaguiProvider } from 'tamagui'

import { TamaguiComponents } from '..'

const testAppConfig = createTamagui(config)

it('should render a Tamagui component', () => {
  const element = render(
    <TamaguiProvider config={testAppConfig}>
      <BaseTemplate
        components={TamaguiComponents}
        dataState={{
          $: DataStateType.Component,
          component: 'XStack',
          children: [
            {
              $: DataStateType.Component,
              component: 'H1',
              children: 'Hello',
            },
            {
              $: DataStateType.Component,
              component: 'Paragraph',
              children: 'Welcome to Tamagui!',
            },
          ],
        }}
        onEvent={jest.fn()}
      />
    </TamaguiProvider>
  )

  expect(element.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <view
        style="flex-direction: row;"
      >
        <text
          accessibilityrole="header"
          style="color: rgb(23, 23, 23); text-transform: none; font-family: InterBold; letter-spacing: -1.5px; font-size: 44px; line-height: 53; margin: 0px 0px 0px 0px;"
        >
          Hello
        </text>
        <text
          style="color: rgb(23, 23, 23); font-family: Inter; letter-spacing: 0; font-size: 14px; line-height: 23;"
        >
          Welcome to Tamagui!
        </text>
      </view>
    </DocumentFragment>
  `)
})
