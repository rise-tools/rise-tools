import { BaseRise } from '@rise-tools/react'
import { config } from '@tamagui/config/v3'
import { render } from '@testing-library/react'
import React from 'react'
import { createTamagui, TamaguiProvider } from 'tamagui'
import { expect, it, vi } from 'vitest'

import { TamaguiComponents } from '../index'

const testAppConfig = createTamagui(config)

it('should render a Tamagui component', () => {
  const element = render(
    <TamaguiProvider config={testAppConfig}>
      <BaseRise
        components={TamaguiComponents}
        model={{
          $: 'component',
          component: 'rise-tools/kit-tamagui/XStack',
          children: [
            {
              $: 'component',
              key: 'H1Component',
              component: 'rise-tools/kit-tamagui/H1',
              children: 'Hello',
            },
            {
              $: 'component',
              key: 'ParagraphComponent',
              component: 'rise-tools/kit-tamagui/Paragraph',
              children: 'Welcome to Tamagui!',
            },
          ],
        }}
        onEvent={vi.fn()}
      />
    </TamaguiProvider>
  )

  expect(element.asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <span
        class=" _dsp_contents"
      >
        <span
          class=" t_light _dsp_contents is_Theme"
        >
          <div
            class="_dsp-flex _ai-stretch _fd-row _fb-auto _bxs-border-box _pos-relative _mih-0px _miw-0px _fs-0"
          >
            <h1
              class="is_H1 font_heading _col-675002279 _tt-1440318557 _ff-299667014 _fow-1366436877 _ls-905095908 _fos-1477259397 _lh-1677663454 _dsp-inline _bxs-border-box _ww-break-word _whiteSpace-normal _mt-0px _mr-0px _mb-0px _ml-0px _ussel-auto"
              role="heading"
            >
              Hello
            </h1>
            <p
              class="is_Paragraph font_body _col-675002279 _ff-299667014 _fow-233016140 _ls-167744059 _fos-229441220 _lh-222976573 _dsp-inline _bxs-border-box _ww-break-word _whiteSpace-normal _mt-0px _mr-0px _mb-0px _ml-0px _ussel-auto"
            >
              Welcome to Tamagui!
            </p>
          </div>
        </span>
      </span>
    </DocumentFragment>
  `)
})
