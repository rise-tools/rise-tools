import {
  clearTerminal,
  debug,
  generateQRCode,
  getConnectionURL,
  getHost,
  highlight,
  link,
  logo,
  spinner,
  startTunnel,
} from '@rise-tools/cli'
import type { Server } from '@rise-tools/server'
import dedent from 'dedent'

import { minimist } from './zx'

type Options = {
  tunnel: boolean
}

const opts = minimist<Options>(process.argv.slice(2), {
  boolean: ['tunnel'],
  default: {
    tunnel: false,
  },
})

export async function setupRiseTools({
  server,
  tunnel = opts.tunnel,
}: {
  server: Server
  tunnel?: boolean
}) {
  const host = (await getHost()) || 'localhost'

  const localUrl = `${server.protocol}://${host}:${server.port}`

  clearTerminal()

  console.log(logo())
  console.log(`Listening on ${highlight(localUrl)}`)

  let deepLinkUrl = localUrl
  if (tunnel) {
    try {
      const host = await spinner('Starting the tunnel...', () => startTunnel(server.port))
      const tunnelUrl = `${server.protocol}://${host}`
      console.log(`Access anywhere on ${highlight(tunnelUrl)}`)

      deepLinkUrl = tunnelUrl
    } catch (e) {
      console.log(
        debug(
          'Failed to connect to Rise Proxy. You can access the server only on your local network.'
        )
      )
    }
  }

  console.log('')

  const deepLink = await getConnectionURL(deepLinkUrl)

  console.log(dedent`
    To preview your app in the Rise Playground, scan the QR code:
    ${await generateQRCode(deepLink)}

    Or open the following link on your device:
    ${link(deepLink)}
  `)
}
