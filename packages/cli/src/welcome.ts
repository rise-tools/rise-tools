import type { Server } from '@rise-tools/server'
import dedent from 'dedent'

import { debug, highlight, link, logo, spinner } from './theme'
import {
  clearTerminal,
  generateQRCode,
  getConnectionInfo,
  getConnectionURL,
  getHost,
  getProjectKey,
  isTunnelProcessRunning,
  startTunnel,
} from './utils'
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
  projectKey,
}: {
  server: Server
  tunnel?: boolean
  projectKey?: string
}) {
  if (await isTunnelProcessRunning()) return

  const host = (await getHost()) || 'localhost'

  const localUrl = `${server.protocol}://${host}:${server.port}`

  clearTerminal()

  console.log(logo())
  console.log(`Listening on ${highlight(localUrl)}`)

  if (!projectKey) {
    projectKey = await getProjectKey()
  }

  let deepLinkUrl = localUrl
  if (tunnel) {
    try {
      const host = await spinner('Starting the tunnel...', async () =>
        startTunnel({ port: server.port, projectKey })
      )
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

  let rootModel = ''
  if (typeof server.models === 'object') {
    if (!('' in server.models)) {
      const model = Object.keys(server.models)[0]
      if (!model) {
        console.log(
          debug(`You didn't provide any models. You will see empty screen in the Playground.`)
        )
      } else {
        rootModel = model
        console.log(debug(`No root model found. Using "${model}" as the root.`))
      }
    }
  }

  console.log('')

  const connectionInfo = await getConnectionInfo(rootModel)
  const deepLink = getConnectionURL(connectionInfo, deepLinkUrl)

  console.log(dedent`
    To preview your app in the Rise Playground, scan the QR code:
    ${await generateQRCode(deepLink)}

    Or open the following link on your device:
    ${link(deepLink)}
  `)
}
