import '@tamagui/polyfill-dev'

import '@tamagui/core/reset.css'
import '@tamagui/core/reset.css'

import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import Head from 'next/head'
import React from 'react'
import type { SolitoAppProps } from 'solito'
import { Provider } from 'app-demo/Provider'

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

function App({ Component, pageProps }: SolitoAppProps) {
  return (
    <>
      <Head>
        <title>Tamagui Example App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default App
