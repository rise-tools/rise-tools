/**
 * Setup instructions: https://tamagui.dev/docs/guides/next-js#pages_apptsx
 */
import '@tamagui/core/reset.css'

/**
 * Custom fonts
 */
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import type { SolitoAppProps } from 'solito'

import Head from 'next/head'
import React from 'react'
import { Provider } from 'app-demo/Provider'

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

function App({ Component, pageProps }: SolitoAppProps) {
  return (
    <>
      <Head>
        <title>EG Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default App
